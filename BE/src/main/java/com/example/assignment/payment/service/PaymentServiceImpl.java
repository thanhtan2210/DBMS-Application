package com.example.assignment.payment.service;

import com.example.assignment.order.entity.Order;
import com.example.assignment.order.repository.OrderRepository;
import com.example.assignment.order.service.OrderStatusService;
import com.example.assignment.payment.dto.InitiatePaymentRequest;
import com.example.assignment.payment.dto.PaymentCallbackRequest;
import com.example.assignment.payment.dto.PaymentInitiationResponse;
import com.example.assignment.payment.entity.Payment;
import com.example.assignment.payment.repository.PaymentRepository;
import com.example.assignment.shared.enums.OrderStatus;
import com.example.assignment.shared.enums.PaymentMethod;
import com.example.assignment.shared.enums.PaymentStatus;
import com.example.assignment.shared.exception.BusinessRuleViolationException;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusService orderStatusService;
    private final MomoPaymentGatewayService momoPaymentGatewayService;

    @Override
    @Transactional
    public PaymentInitiationResponse initiatePayment(InitiatePaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", request.getOrderId()));

        if (order.getOrderStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BusinessRuleViolationException("Order is not in a payable state: " + order.getOrderStatus());
        }

        paymentRepository.findTopByOrder_OrderIdOrderByCreatedAtDesc(order.getOrderId())
            .filter(existingPayment -> existingPayment.getPaymentStatus() != PaymentStatus.FAILED)
            .ifPresent(existingPayment -> {
                throw new BusinessRuleViolationException(
                    "PAYMENT_EXISTS",
                    "Order already has an active payment: " + existingPayment.getTransactionRef());
            });

        String txRef = "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        PaymentMethod paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod());
        Payment payment = Payment.builder()
                .order(order)
            .paymentMethod(paymentMethod)
            .paymentProvider(request.getPaymentProvider() != null ? request.getPaymentProvider() : paymentMethod.name())
                .transactionRef(txRef)
                .amount(order.getTotalAmount())
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        String payUrl = null;

        if (paymentMethod == PaymentMethod.MOMO) {
            payUrl = momoPaymentGatewayService.createPayUrl(savedPayment);
        }

        log.info("Payment initiated: txRef={}, orderId={}", txRef, order.getOrderId());
        return PaymentInitiationResponse.builder()
                .payment(savedPayment)
                .payUrl(payUrl)
                .provider(paymentMethod.name())
                .message(paymentMethod == PaymentMethod.MOMO ? "MoMo payment created" : "Payment created")
                .build();
    }

    @Override
    @Transactional
    public Payment handleCallback(PaymentCallbackRequest request) {
        Payment payment = paymentRepository.findByTransactionRef(request.getTransactionRef())
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "transactionRef", request.getTransactionRef()));

        // Idempotent: ignore duplicate final-state callbacks
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS
                || payment.getPaymentStatus() == PaymentStatus.FAILED) {
            log.warn("Duplicate callback ignored for txRef={}", request.getTransactionRef());
            return payment;
        }

        payment.setRawResponse(request.getRawPayload());

        if ("SUCCESS".equalsIgnoreCase(request.getStatus())) {
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setPaidAt(LocalDateTime.now());

            Order order = payment.getOrder();
            order.setPaymentStatus(com.example.assignment.shared.enums.PaymentStatus.SUCCESS);
            orderRepository.save(order);

            orderStatusService.updateStatus(order.getOrderId(), OrderStatus.PAID, "PAYMENT_GATEWAY", "Payment confirmed");
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            orderStatusService.updateStatus(payment.getOrder().getOrderId(),
                    OrderStatus.PAYMENT_FAILED, "PAYMENT_GATEWAY", "Payment failed");
        }

        paymentRepository.save(payment);
        return payment;
    }

    @Override
    @Transactional(readOnly = true)
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", paymentId));
    }

    @Override
    @Transactional(readOnly = true)
    public Payment getLatestPaymentByOrderId(Long orderId) {
        return paymentRepository.findTopByOrder_OrderIdOrderByCreatedAtDesc(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId.toString()));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Payment> listPayments(String status, Pageable pageable) {
        if (status != null) {
            return paymentRepository.findByPaymentStatus(PaymentStatus.valueOf(status), pageable);
        }
        return paymentRepository.findAll(pageable);
    }
}

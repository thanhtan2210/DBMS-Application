package com.example.assignment.analytics.service;

import com.example.assignment.order.repository.OrderItemRepository;
import com.example.assignment.order.repository.OrderRepository;
import com.example.assignment.payment.repository.PaymentRepository;
import com.example.assignment.shared.enums.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * FR-09: Sales Reporting — executes aggregate queries for admin dashboard.
 */
@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getSalesOverview(LocalDateTime from, LocalDateTime to) {
        Object[] agg = (Object[]) orderRepository.aggregateRevenueByDateRange(from, to);
        return Map.of(
                "totalOrders", Objects.requireNonNullElse(agg[0], 0L),
                "grossRevenue", Objects.requireNonNullElse(agg[1], java.math.BigDecimal.ZERO),
                "totalDiscount", Objects.requireNonNullElse(agg[2], java.math.BigDecimal.ZERO),
                "from", from,
                "to", to
        );
    }

    @Transactional(readOnly = true)
    public List<Object[]> getTopProducts(LocalDateTime from, LocalDateTime to, int limit) {
        return orderItemRepository.topProductsByQuantity(from, to, PageRequest.of(0, limit));
    }

    @Transactional(readOnly = true)
    public List<Object[]> getRevenueByCategory() {
        return paymentRepository.revenueByPaymentMethod(PaymentStatus.SUCCESS);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getOrderCountByStatus() {
        return orderRepository.countByOrderStatus();
    }

    @Transactional(readOnly = true)
    public List<Object[]> getPaymentSuccessRate() {
        return paymentRepository.successRateByPaymentMethod();
    }
}

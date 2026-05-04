package com.example.assignment.payment.service;

import com.example.assignment.payment.dto.InitiatePaymentRequest;
import com.example.assignment.payment.dto.PaymentCallbackRequest;
import com.example.assignment.payment.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    Payment initiatePayment(InitiatePaymentRequest request);
    Payment handleCallback(PaymentCallbackRequest request);
    Payment getPaymentById(Long paymentId);
    Page<Payment> listPayments(String status, Pageable pageable);
}

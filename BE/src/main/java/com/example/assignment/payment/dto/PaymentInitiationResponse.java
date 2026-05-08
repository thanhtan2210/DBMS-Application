package com.example.assignment.payment.dto;

import com.example.assignment.payment.entity.Payment;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentInitiationResponse {
    private Payment payment;
    private String payUrl;
    private String provider;
    private String message;
}
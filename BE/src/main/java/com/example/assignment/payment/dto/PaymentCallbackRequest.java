package com.example.assignment.payment.dto;

import lombok.Data;

@Data
public class PaymentCallbackRequest {
    private String transactionRef;
    private String status; // "SUCCESS" or "FAILED"
    private String rawPayload;
}

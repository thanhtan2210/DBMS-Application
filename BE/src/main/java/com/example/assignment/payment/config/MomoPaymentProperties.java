package com.example.assignment.payment.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app.payment.momo")
public class MomoPaymentProperties {
    private String partnerCode;
    private String accessKey;
    private String secretKey;
    private String endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    private String returnUrl = "http://localhost:5173/payment/momo-return";
    private String ipnUrl = "http://localhost:8080/api/payments/momo/ipn";
    private String requestType = "captureWallet";
    private String lang = "vi";
}
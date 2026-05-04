package com.example.assignment.payment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Schema(description = "Request body for initiating a payment for a placed order")
@Data
public class InitiatePaymentRequest {

    @Schema(description = "ID of the order to pay for", example = "201", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    private Long orderId;

    @Schema(description = "Payment method: COD | BANK_TRANSFER | VNPAY | MOMO", example = "VNPAY",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    private String paymentMethod;

    @Schema(description = "Payment provider / gateway code (optional, used when multiple gateways are available)",
            example = "VNPAY_SANDBOX")
    private String paymentProvider;
}


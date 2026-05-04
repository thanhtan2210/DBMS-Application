package com.example.assignment.order.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Schema(description = "Request body for previewing or placing an order")
@Data
public class PlaceOrderRequest {

    @Schema(description = "ID of the customer placing the order", example = "42", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    private Long customerId;

    @Schema(description = "ID of the shipping address to deliver to", example = "15", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    private Long shippingAddressId;

    @Schema(description = "List of cart item IDs (only selected items) to include in this order",
            example = "[101, 102, 105]", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotEmpty
    private List<Long> selectedCartItemIds;

    @Schema(description = "Optional list of promotion/coupon codes to apply", example = "[\"SUMMER20\", \"NEWUSER\"]")
    private List<String> promotionCodes;

    @Schema(description = "Payment method: COD | BANK_TRANSFER | VNPAY | MOMO", example = "VNPAY",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    private String paymentMethod;
}


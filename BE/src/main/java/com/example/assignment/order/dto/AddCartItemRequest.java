package com.example.assignment.order.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Schema(description = "Request body for adding a product variant to the shopping cart")
@Data
public class AddCartItemRequest {

    @Schema(description = "ID of the product variant to add", example = "88", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    private Long variantId;

    @Schema(description = "Quantity to add (must be ≥ 1)", example = "2", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull
    @Min(1)
    private Integer quantity;
}


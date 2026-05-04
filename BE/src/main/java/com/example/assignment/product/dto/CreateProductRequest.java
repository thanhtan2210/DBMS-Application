package com.example.assignment.product.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Schema(description = "Request body for creating or updating a product")
@Data
public class CreateProductRequest {

    @Schema(description = "Unique stock-keeping unit identifier", example = "SKU-001-BLK-M", maxLength = 100)
    @NotBlank
    @Size(max = 100)
    private String sku;

    @Schema(description = "Display name of the product", example = "Classic Black T-Shirt", maxLength = 500)
    @NotBlank
    @Size(max = 500)
    private String productName;

    @Schema(description = "Brand ID (FK to brands table)", example = "3")
    private Long brandId;

    @Schema(description = "Category ID (FK to categories table)", example = "7")
    private Long categoryId;

    @Schema(description = "Full product description (HTML or plain text)", example = "100% cotton, machine washable.")
    private String description;

    @Schema(description = "Selling price (must be ≥ 0.01)", example = "299000.00")
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    @Schema(description = "Cost / purchase price (optional, used for profit calculation)", example = "150000.00")
    @DecimalMin("0.00")
    private BigDecimal costPrice;
}


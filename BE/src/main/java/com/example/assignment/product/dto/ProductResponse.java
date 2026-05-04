package com.example.assignment.product.dto;

import com.example.assignment.product.entity.Product;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {

    private Long productId;
    private String sku;
    private String productName;
    private String brandName;
    private String categoryName;
    private String description;
    private BigDecimal price;
    private BigDecimal costPrice;
    private String status;
    private LocalDateTime createdAt;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .sku(product.getSku())
                .productName(product.getProductName())
                .brandName(product.getBrand() != null ? product.getBrand().getBrandName() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .description(product.getDescription())
                .price(product.getPrice())
                .costPrice(product.getCostPrice())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .build();
    }
}

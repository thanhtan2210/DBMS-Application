package com.example.assignment.promotion.dto;

import com.example.assignment.shared.enums.DiscountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PromotionRequest {
    @NotBlank
    private String promotionCode;
    @NotBlank
    private String promotionName;
    @NotNull
    private DiscountType discountType;
    @NotNull
    private BigDecimal discountValue;
    
    private BigDecimal minimumOrderAmount;
    private BigDecimal maxDiscountAmount;
    private Integer usageLimit;
    
    @NotNull
    private LocalDateTime startTime;
    @NotNull
    private LocalDateTime endTime;
    
    private String status = "ACTIVE";
}

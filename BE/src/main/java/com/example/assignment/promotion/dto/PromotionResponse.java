package com.example.assignment.promotion.dto;

import com.example.assignment.promotion.entity.Promotion;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PromotionResponse {
    private Long promotionId;
    private String promotionCode;
    private String promotionName;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal minimumOrderAmount;
    private BigDecimal maxDiscountAmount;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;

    public static PromotionResponse from(Promotion promotion) {
        return PromotionResponse.builder()
                .promotionId(promotion.getPromotionId())
                .promotionCode(promotion.getPromotionCode())
                .promotionName(promotion.getPromotionName())
                .discountType(promotion.getDiscountType().name())
                .discountValue(promotion.getDiscountValue())
                .minimumOrderAmount(promotion.getMinimumOrderAmount())
                .maxDiscountAmount(promotion.getMaxDiscountAmount())
                .usageLimit(promotion.getUsageLimit())
                .usedCount(promotion.getUsedCount())
                .startTime(promotion.getStartTime())
                .endTime(promotion.getEndTime())
                .status(promotion.getStatus())
                .build();
    }
}

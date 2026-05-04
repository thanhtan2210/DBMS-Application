package com.example.assignment.promotion.entity;

import com.example.assignment.shared.entity.BaseEntity;
import com.example.assignment.shared.enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions", indexes = {
        @Index(name = "idx_promotions_code", columnList = "promotion_code", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Long promotionId;

    @Column(name = "promotion_code", nullable = false, unique = true, length = 100)
    private String promotionCode;

    @Column(name = "promotion_name", nullable = false, length = 255)
    private String promotionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "minimum_order_amount", precision = 15, scale = 2)
    private BigDecimal minimumOrderAmount;

    @Column(name = "max_discount_amount", precision = 15, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    @Builder.Default
    private Integer usedCount = 0;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";
}

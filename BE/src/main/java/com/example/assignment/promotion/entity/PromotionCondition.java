package com.example.assignment.promotion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "promotion_conditions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "condition_id")
    private Long conditionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", nullable = false)
    private Promotion promotion;

    @Column(name = "applicable_category_id")
    private Long applicableCategoryId;

    @Column(name = "applicable_product_id")
    private Long applicableProductId;

    @Column(name = "applicable_customer_tier", length = 50)
    private String applicableCustomerTier;

    @Column(name = "minimum_quantity")
    private Integer minimumQuantity;
}

package com.example.assignment.analytics.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "sales_summary_daily")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesSummaryDaily {

    @EmbeddedId
    private SalesSummaryDailyId id;

    @Column(name = "total_orders", nullable = false)
    @Builder.Default
    private Integer totalOrders = 0;

    @Column(name = "total_items_sold", nullable = false)
    @Builder.Default
    private Integer totalItemsSold = 0;

    @Column(name = "gross_revenue", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal grossRevenue = BigDecimal.ZERO;

    @Column(name = "net_revenue", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal netRevenue = BigDecimal.ZERO;

    @Column(name = "total_discount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalDiscount = BigDecimal.ZERO;

    @Column(name = "total_customers", nullable = false)
    @Builder.Default
    private Integer totalCustomers = 0;

    // Convenience accessor
    public LocalDate getSummaryDate() {
        return id != null ? id.getSummaryDate() : null;
    }
}

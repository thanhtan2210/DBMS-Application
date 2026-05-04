package com.example.assignment.analytics.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "forecast_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForecastSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "snapshot_id")
    private Long snapshotId;

    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate;

    @Column(name = "lookback_days", nullable = false)
    private Integer lookbackDays;

    @Column(name = "predicted_demand", nullable = false, precision = 15, scale = 4)
    private BigDecimal predictedDemand;

    @Column(name = "recommended_restock_qty", nullable = false)
    private Integer recommendedRestockQty;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        this.generatedAt = LocalDateTime.now();
    }
}

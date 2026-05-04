package com.example.assignment.analytics.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Composite PK class for SalesSummaryDaily.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SalesSummaryDailyId implements Serializable {

    @Column(name = "summary_date")
    private LocalDate summaryDate;
}

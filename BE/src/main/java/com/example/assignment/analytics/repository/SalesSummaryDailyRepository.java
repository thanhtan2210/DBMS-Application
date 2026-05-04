package com.example.assignment.analytics.repository;

import com.example.assignment.analytics.entity.SalesSummaryDaily;
import com.example.assignment.analytics.entity.SalesSummaryDailyId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesSummaryDailyRepository extends JpaRepository<SalesSummaryDaily, SalesSummaryDailyId> {
    List<SalesSummaryDaily> findByIdSummaryDateBetween(LocalDate from, LocalDate to);
}

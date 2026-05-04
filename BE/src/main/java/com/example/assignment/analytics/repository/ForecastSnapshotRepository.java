package com.example.assignment.analytics.repository;

import com.example.assignment.analytics.entity.ForecastSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ForecastSnapshotRepository extends JpaRepository<ForecastSnapshot, Long> {

    List<ForecastSnapshot> findByVariantId(Long variantId);

    Optional<ForecastSnapshot> findTopByVariantIdOrderByGeneratedAtDesc(Long variantId);

    // FR-08: Subquery — variants whose recent sales exceed their historical average
    @Query(value = """
            SELECT fs.* FROM forecast_snapshots fs
            WHERE fs.predicted_demand > (
                SELECT AVG(fs2.predicted_demand) FROM forecast_snapshots fs2
                WHERE fs2.variant_id = fs.variant_id
            )
            AND fs.forecast_date = :forecastDate
            """, nativeQuery = true)
    List<ForecastSnapshot> findBelowStockForecastsAboveAvgDemand(@Param("forecastDate") LocalDate forecastDate);

    List<ForecastSnapshot> findByForecastDate(LocalDate forecastDate);
}

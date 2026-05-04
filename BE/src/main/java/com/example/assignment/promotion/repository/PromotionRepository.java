package com.example.assignment.promotion.repository;

import com.example.assignment.promotion.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    Optional<Promotion> findByPromotionCode(String code);

    // FR-06: Composite — active promotions within time window + order min
    @Query("""
            SELECT p FROM Promotion p
            WHERE p.status = 'ACTIVE'
              AND p.startTime <= :now
              AND p.endTime >= :now
              AND (:minOrderAmount IS NULL OR p.minimumOrderAmount <= :minOrderAmount)
            """)
    List<Promotion> findValidPromotions(
            @Param("now") LocalDateTime now,
            @Param("minOrderAmount") BigDecimal minOrderAmount);

    // FR-06: Subquery — promotions used more than average
    @Query("""
            SELECT p FROM Promotion p
            WHERE p.usedCount > (SELECT AVG(p2.usedCount) FROM Promotion p2)
            """)
    List<Promotion> findAboveAverageUsage();

    // FR-06: Aggregate — total discount by campaign
    @Query("""
            SELECT p.promotionCode, SUM(op.discountAmount)
            FROM OrderPromotion op
            JOIN op.promotion p
            GROUP BY p.promotionCode
            ORDER BY SUM(op.discountAmount) DESC
            """)
    List<Object[]> totalDiscountByPromotion(Pageable pageable);

    // FR-06: Composite — filter active by date + status
    Page<Promotion> findByStatusAndStartTimeBeforeAndEndTimeAfter(
            String status, LocalDateTime now1, LocalDateTime now2, Pageable pageable);
}

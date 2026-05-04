package com.example.assignment.analytics.repository;

import com.example.assignment.analytics.entity.UserEvent;
import com.example.assignment.shared.enums.EventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserEventRepository extends JpaRepository<UserEvent, Long> {

    // FR-07: Single-condition — events by type
    Page<UserEvent> findByEventType(EventType eventType, Pageable pageable);

    // FR-07: Composite-condition — by type + date range + product
    List<UserEvent> findByEventTypeAndProductIdAndEventTimeBetween(
            EventType eventType, Long productId,
            LocalDateTime from, LocalDateTime to);

    // FR-07: Aggregate — counts per event type (conversion funnel)
    @Query("""
            SELECT e.eventType, COUNT(e), COUNT(DISTINCT e.sessionId)
            FROM UserEvent e
            WHERE e.eventTime BETWEEN :from AND :to
            GROUP BY e.eventType
            ORDER BY COUNT(e) DESC
            """)
    List<Object[]> funnelAggregation(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // FR-07: Subquery — products with cart-add count above platform average
    @Query(value = """
            SELECT product_id, COUNT(*) as add_count
            FROM user_events
            WHERE event_type = 'ADD_TO_CART'
              AND event_time BETWEEN :from AND :to
            GROUP BY product_id
            HAVING COUNT(*) > (
                SELECT AVG(sub.cnt) FROM (
                    SELECT COUNT(*) as cnt FROM user_events
                    WHERE event_type = 'ADD_TO_CART'
                    GROUP BY product_id
                ) sub
            )
            ORDER BY add_count DESC
            """, nativeQuery = true)
    List<Object[]> productsAboveAverageCartAddRate(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    // FR-07: Join query — top viewed products with category info
    @Query("""
            SELECT e.productId, p.productName, p.category.categoryName, COUNT(e)
            FROM UserEvent e
            JOIN Product p ON p.productId = e.productId
            WHERE e.eventType = 'VIEW_PRODUCT'
              AND e.eventTime BETWEEN :from AND :to
            GROUP BY e.productId, p.productName, p.category.categoryName
            ORDER BY COUNT(e) DESC
            """)
    List<Object[]> topViewedProducts(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);
}

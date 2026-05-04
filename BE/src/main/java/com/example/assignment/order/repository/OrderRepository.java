package com.example.assignment.order.repository;

import com.example.assignment.order.entity.Order;
import com.example.assignment.shared.enums.OrderStatus;
import com.example.assignment.shared.enums.PaymentStatus;
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
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    // FR-10: Single-condition — orders by status
    Page<Order> findByOrderStatus(OrderStatus status, Pageable pageable);

    List<Order> findByCustomer_CustomerId(Long customerId);

    // FR-10: Composite-condition — by status + date range + payment status
    @Query("""
            SELECT o FROM Order o
            WHERE (:orderStatus IS NULL OR o.orderStatus = :orderStatus)
              AND (:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus)
              AND (:from IS NULL OR o.createdAt >= :from)
              AND (:to IS NULL OR o.createdAt <= :to)
            """)
    Page<Order> findByFilters(
            @Param("orderStatus") OrderStatus orderStatus,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);

    // FR-03: Join query — order with customer + items + products
    @Query("""
            SELECT DISTINCT o FROM Order o
            JOIN FETCH o.customer c
            JOIN FETCH c.user u
            WHERE o.orderId = :id
            """)
    Optional<Order> findByIdWithCustomer(@Param("id") Long id);

    // FR-03: Subquery — customers whose latest order total exceeds their average
    @Query(value = """
            SELECT o.* FROM orders o
            WHERE o.customer_id IN (
                SELECT o2.customer_id
                FROM orders o2
                GROUP BY o2.customer_id
                HAVING MAX(o2.total_amount) > AVG(o2.total_amount)
            )
            """, nativeQuery = true)
    List<Order> findOrdersFromHighValueCustomers();

    // FR-09: Aggregate — total revenue, order count in date range
    @Query("""
            SELECT COUNT(o), SUM(o.totalAmount), SUM(o.discountAmount)
            FROM Order o
            WHERE o.createdAt BETWEEN :from AND :to
              AND o.orderStatus NOT IN ('CANCELLED', 'PAYMENT_FAILED')
            """)
    Object[] aggregateRevenueByDateRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    // FR-10: Aggregate — count by status
    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o GROUP BY o.orderStatus")
    List<Object[]> countByOrderStatus();
}

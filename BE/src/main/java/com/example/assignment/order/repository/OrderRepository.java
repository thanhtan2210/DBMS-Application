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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByCustomer_CustomerId(Long customerId);

    // FR-10: Composite-condition — by status + date range + payment status
    @Query("""
            SELECT o FROM Order o
            WHERE (:orderStatus IS NULL OR o.orderStatus = :orderStatus)
              AND (:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus)
              AND (o.createdAt >= COALESCE(:from, o.createdAt))
              AND (o.createdAt <= COALESCE(:to, o.createdAt))
              AND (CAST(:keyword AS string) IS NULL OR CAST(:keyword AS string) = '' 
                   OR LOWER(o.orderCode) LIKE LOWER(CAST(:keyword AS string)))
            """)
    Page<Order> findByFilters(
            @Param("orderStatus") OrderStatus orderStatus,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("""
            SELECT DISTINCT o FROM Order o
            LEFT JOIN FETCH o.customer c
            LEFT JOIN FETCH c.user u
            LEFT JOIN FETCH o.orderItems oi
            LEFT JOIN FETCH oi.variant v
            LEFT JOIN FETCH v.product p
            WHERE o.orderId = :id
            """)
    Optional<Order> findByIdWithDetails(@Param("id") Long id);

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

    @Query("""
            SELECT COUNT(o), SUM(o.totalAmount), SUM(o.discountAmount)
            FROM Order o
            WHERE o.createdAt BETWEEN :from AND :to
              AND o.orderStatus NOT IN (:excludedStatuses)
            """)
    List<Object[]> aggregateRevenueByDateRange(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("excludedStatuses") List<OrderStatus> excludedStatuses);
    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o GROUP BY o.orderStatus")
    List<Object[]> countByOrderStatus();
}

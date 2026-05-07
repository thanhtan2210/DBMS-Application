package com.example.assignment.order.repository;

import com.example.assignment.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder_OrderId(Long orderId);

    // FR-09: Top products by quantity sold
    @Query("""
            SELECT oi.variant.product.productName, SUM(oi.quantity), SUM(oi.lineTotal)
            FROM OrderItem oi
            JOIN oi.order o
            WHERE o.createdAt BETWEEN :from AND :to
              AND o.orderStatus NOT IN ('CANCELLED', 'PAYMENT_FAILED')
            GROUP BY oi.variant.product.productName
            ORDER BY SUM(oi.quantity) DESC
            """)
    List<Object[]> topProductsByQuantity(
            @Param("from") java.time.LocalDateTime from,
            @Param("to") java.time.LocalDateTime to,
            org.springframework.data.domain.Pageable pageable);

    @Query("""
            SELECT oi.variant.product.category.categoryName, SUM(oi.lineTotal)
            FROM OrderItem oi
            JOIN oi.order o
            WHERE o.orderStatus NOT IN ('CANCELLED', 'PAYMENT_FAILED')
            GROUP BY oi.variant.product.category.categoryName
            """)
    List<Object[]> revenueByCategory();
}

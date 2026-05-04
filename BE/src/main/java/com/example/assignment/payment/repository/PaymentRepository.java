package com.example.assignment.payment.repository;

import com.example.assignment.payment.entity.Payment;
import com.example.assignment.shared.enums.PaymentMethod;
import com.example.assignment.shared.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // FR-04: Single-condition — payment by transaction_ref
    Optional<Payment> findByTransactionRef(String transactionRef);

    boolean existsByTransactionRef(String transactionRef);

    List<Payment> findByOrder_OrderId(Long orderId);

    // FR-04: Composite — payments with status filter
    Page<Payment> findByPaymentStatus(PaymentStatus status, Pageable pageable);

    // FR-04: Join query — payments + orders + customer (done via JPQL with fetch join)
    @Query("""
            SELECT p FROM Payment p
            JOIN FETCH p.order o
            JOIN FETCH o.customer c
            WHERE p.paymentId = :id
            """)
    Optional<Payment> findByIdWithOrderAndCustomer(@Param("id") Long id);

    // FR-04: Aggregate — success rate by payment method
    @Query("""
            SELECT p.paymentMethod,
                   COUNT(p),
                   SUM(CASE WHEN p.paymentStatus = 'SUCCESS' THEN 1 ELSE 0 END)
            FROM Payment p
            GROUP BY p.paymentMethod
            """)
    List<Object[]> successRateByPaymentMethod();

    // FR-09: Revenue by payment method
    @Query("""
            SELECT p.paymentMethod, SUM(p.amount)
            FROM Payment p
            WHERE p.paymentStatus = :status
            GROUP BY p.paymentMethod
            """)
    List<Object[]> revenueByPaymentMethod(@Param("status") PaymentStatus status);
}

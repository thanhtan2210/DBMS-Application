package com.example.assignment.payment.entity;

import com.example.assignment.order.entity.Order;
import com.example.assignment.shared.entity.BaseEntity;
import com.example.assignment.shared.enums.PaymentMethod;
import com.example.assignment.shared.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payments_transaction_ref", columnList = "transaction_ref", unique = true),
        @Index(name = "idx_payments_payment_status", columnList = "payment_status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_provider", length = 100)
    private String paymentProvider;

    @Column(name = "transaction_ref", unique = true, length = 255)
    private String transactionRef;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "raw_response", columnDefinition = "TEXT")
    private String rawResponse;
}

package com.example.assignment.shared.enums;

/**
 * Order lifecycle statuses with controlled FSM transitions.
 * Valid transitions:
 *   PENDING_PAYMENT -> PAID | PAYMENT_FAILED | CANCELLED
 *   PAYMENT_FAILED  -> PENDING_PAYMENT | CANCELLED
 *   PAID            -> CONFIRMED | CANCELLED
 *   CONFIRMED       -> PROCESSING | CANCELLED
 *   PROCESSING      -> PACKED
 *   PACKED          -> SHIPPED
 *   SHIPPED         -> DELIVERED | RETURNED
 *   DELIVERED       -> RETURNED
 */
public enum OrderStatus {
    PENDING_PAYMENT,
    PAID,
    CONFIRMED,
    PROCESSING,
    PACKED,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    PAYMENT_FAILED,
    RETURNED
}

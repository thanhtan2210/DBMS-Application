package com.example.assignment.order.dto;

import com.example.assignment.order.entity.Order;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderResponse {

    private Long orderId;
    private String orderCode;
    private String orderStatus;
    private String paymentStatus;
    private BigDecimal subtotalAmount;
    private BigDecimal discountAmount;
    private BigDecimal shippingFee;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderCode(order.getOrderCode())
                .orderStatus(order.getOrderStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .subtotalAmount(order.getSubtotalAmount())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .build();
    }
}

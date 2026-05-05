package com.example.assignment.order.dto;

import com.example.assignment.order.entity.Order;
import com.example.assignment.user.entity.Address;
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
    
    private CustomerDTO customer;
    private AddressDTO shippingAddress;
    private java.util.List<OrderItemDTO> items;

    @Data
    @Builder
    public static class CustomerDTO {
        private Long id;
        private String name;
        private String email;
    }

    @Data
    @Builder
    public static class AddressDTO {
        private String receiverName;
        private String phone;
        private String fullAddress;
    }

    @Data
    @Builder
    public static class OrderItemDTO {
        private Long productId;
        private String productName;
        private String variantName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
    }

    public static OrderResponse from(Order order) {
        OrderResponseBuilder builder = OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderCode(order.getOrderCode())
                .orderStatus(order.getOrderStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .subtotalAmount(order.getSubtotalAmount())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt());

        if (order.getCustomer() != null) {
            builder.customer(CustomerDTO.builder()
                    .id(order.getCustomer().getCustomerId())
                    .name(order.getCustomer().getUser().getFullName())
                    .email(order.getCustomer().getUser().getEmail())
                    .build());
        }

        if (order.getShippingAddress() != null) {
            Address addr = order.getShippingAddress();
            String fullAddr = String.format("%s, %s, %s, %s", 
                addr.getStreet(), 
                addr.getWard() != null ? addr.getWard() : "", 
                addr.getDistrict() != null ? addr.getDistrict() : "", 
                addr.getCity());
            
            builder.shippingAddress(AddressDTO.builder()
                    .receiverName(addr.getReceiverName())
                    .phone(addr.getPhone())
                    .fullAddress(fullAddr.replace(", ,", ",").trim())
                    .build());
        }

        if (order.getOrderItems() != null) {
            builder.items(order.getOrderItems().stream().map(item -> OrderItemDTO.builder()
                    .productId(item.getVariant().getProduct().getProductId())
                    .productName(item.getVariant().getProduct().getProductName())
                    .variantName(item.getVariant().getVariantName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .lineTotal(item.getLineTotal())
                    .build()
            ).collect(java.util.stream.Collectors.toList()));
        }

        return builder.build();
    }
}

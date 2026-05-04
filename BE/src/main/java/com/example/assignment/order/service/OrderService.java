package com.example.assignment.order.service;

import com.example.assignment.order.dto.OrderResponse;
import com.example.assignment.order.dto.PlaceOrderRequest;
import com.example.assignment.shared.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(PlaceOrderRequest request);
    OrderResponse getOrderById(Long orderId);
    List<OrderResponse> getOrdersByCustomer(Long customerId);
    OrderResponse previewCheckout(PlaceOrderRequest request);
}

package com.example.assignment.order.controller;

import com.example.assignment.order.dto.OrderResponse;
import com.example.assignment.order.dto.PlaceOrderRequest;
import com.example.assignment.order.service.OrderService;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * FR-03: Order Placement — customer + admin routes.
 */
@Tag(name = "Orders", description = "FR-03 — Order placement, checkout preview and order retrieval")
@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Preview checkout",
               description = "Calculates the order totals (subtotal, discounts, shipping, tax) for the selected " +
                             "cart items without actually placing the order. Useful for order summary pages.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Checkout preview calculated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error — missing required fields"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer, address or cart item not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Insufficient stock or invalid promotion code")
    })
    @PostMapping("/api/checkout/preview")
    public ResponseEntity<ApiResponse<OrderResponse>> preview(@Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success(orderService.previewCheckout(request)));
    }

    @Operation(summary = "Place an order",
               description = "Creates a confirmed order from the selected cart items, applies promotions, " +
                             "reserves inventory and creates a pending payment record.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Order placed successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer, address or cart item not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Insufficient stock or invalid promotion code")
    })
    @PostMapping("/api/orders")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed", orderService.placeOrder(request)));
    }

    @Operation(summary = "Get order by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Order found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found")
    })
    @GetMapping("/api/orders/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @Parameter(description = "Order ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id)));
    }

    @Operation(summary = "List all orders for a customer",
               description = "Returns the full order history for the specified customer, ordered by creation date descending.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Order list returned"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found")
    })
    @GetMapping("/api/customers/{customerId}/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getCustomerOrders(
            @Parameter(description = "Customer ID", required = true) @PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrdersByCustomer(customerId)));
    }
}


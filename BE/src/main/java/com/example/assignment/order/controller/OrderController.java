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

    @Operation(summary = "List all orders",
               description = "Returns a paginated list of all orders, ordered by creation date descending.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Order list returned")
    })
    @GetMapping("/api/orders")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<OrderResponse>>> getAllOrders(
            @Parameter(description = "Search keyword (order code or customer name)") @RequestParam(required = false) String keyword,
            @org.springframework.data.web.PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) 
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(keyword, pageable)));
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
    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
        String invoiceContent = "INVOICE FOR ORDER ID: " + id + "\n" +
                "Date: " + java.time.LocalDateTime.now() + "\n" +
                "Status: COMPLETED\n" +
                "Thank you for shopping with us!";
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice_" + id + ".txt")
                .body(invoiceContent.getBytes());
    }
    }



package com.example.assignment.payment.controller;

import com.example.assignment.payment.dto.InitiatePaymentRequest;
import com.example.assignment.payment.dto.PaymentCallbackRequest;
import com.example.assignment.payment.dto.PaymentInitiationResponse;
import com.example.assignment.payment.entity.Payment;
import com.example.assignment.payment.service.PaymentService;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * FR-04: Payment Integration — customer + admin routes.
 */
@Tag(name = "Payments", description = "FR-04 — Payment initiation, callback processing and admin payment queries")
@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Initiate a payment",
               description = "Creates a pending payment record for an order and returns the details needed " +
                             "to redirect the customer to the payment provider (e.g. VNPay, Momo, COD).")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment initiated — payUrl and payment record returned"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error — missing orderId or paymentMethod"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Order already has an active payment")
    })
    @PostMapping("/api/payments/initiate")
    public ResponseEntity<ApiResponse<PaymentInitiationResponse>> initiate(@Valid @RequestBody InitiatePaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment initiated", paymentService.initiatePayment(request)));
    }

    @Operation(summary = "Handle payment gateway callback",
               description = "Webhook endpoint called by the payment gateway after the transaction completes. " +
                             "Updates the payment and order status based on the gateway result (SUCCESS/FAILED). " +
                             "Should be whitelisted from authentication.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Callback processed successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Unknown transaction reference")
    })
    @PostMapping("/api/payments/callback")
    public ResponseEntity<ApiResponse<Payment>> callback(@RequestBody PaymentCallbackRequest request) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.handleCallback(request)));
    }

    @Operation(summary = "Get latest payment for an order",
               description = "Returns the most recent payment record created for the specified order.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Payment not found")
    })
    @GetMapping("/api/payments/order/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> getByOrderId(
            @Parameter(description = "Order ID", required = true) @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getLatestPaymentByOrderId(orderId)));
    }

    @Operation(summary = "List payments (admin)",
               description = "Returns a paginated list of all payments. Optionally filter by status: PENDING | SUCCESS | FAILED | REFUNDED.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Paginated payment list returned")
    })
    @GetMapping("/api/admin/payments")
    public ResponseEntity<ApiResponse<?>> list(
            @Parameter(description = "Filter by payment status: PENDING | SUCCESS | FAILED | REFUNDED")
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.listPayments(status, pageable)));
    }

    @Operation(summary = "Get payment by ID (admin)")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Payment not found")
    })
    @GetMapping("/api/admin/payments/{id}")
    public ResponseEntity<ApiResponse<Payment>> getById(
            @Parameter(description = "Payment ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentById(id)));
    }
}


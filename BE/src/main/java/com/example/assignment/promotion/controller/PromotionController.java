package com.example.assignment.promotion.controller;

import com.example.assignment.promotion.service.PromotionService;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * FR-06: Discounts and Promotions — admin + checkout routes.
 */
@Tag(name = "Promotions", description = "FR-06 — Validate promotion codes and apply discounts at checkout or order level")
@RestController
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @Operation(summary = "Calculate discount for a promotion code",
               description = "Validates the promotion code and returns the discount amount to deduct from the " +
                             "order. Does NOT persist any state — use this for real-time price preview during checkout.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Discount amount returned"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid, expired or usage-limit-exceeded promotion code"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Order amount below minimum purchase threshold")
    })
    @PostMapping("/api/checkout/apply-promotion")
    public ResponseEntity<ApiResponse<BigDecimal>> applyPromotion(
            @Parameter(description = "Promotion / coupon code", required = true) @RequestParam String code,
            @Parameter(description = "Total order amount before discount (used for threshold validation)", required = true)
            @RequestParam BigDecimal orderAmount) {
        BigDecimal discount = promotionService.validateAndCalculateDiscount(code, orderAmount);
        return ResponseEntity.ok(ApiResponse.success("Discount calculated", discount));
    }

    @Operation(summary = "Apply promotion to an existing order",
               description = "Attaches a valid promotion to a placed order and persists the discount. " +
                             "Can only be applied when the order is in PENDING_PAYMENT status.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Promotion applied to order"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid or already-used promotion code"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Promotion already applied to this order")
    })
    @PostMapping("/api/orders/{orderId}/promotions")
    public ResponseEntity<ApiResponse<Void>> applyToOrder(
            @Parameter(description = "Order ID", required = true) @PathVariable Long orderId,
            @Parameter(description = "Promotion / coupon code", required = true) @RequestParam String code) {
        promotionService.applyPromotionToOrder(orderId, code);
        return ResponseEntity.ok(ApiResponse.success("Promotion applied to order", null));
    }
}


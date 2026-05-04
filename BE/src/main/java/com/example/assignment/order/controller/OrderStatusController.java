package com.example.assignment.order.controller;

import com.example.assignment.order.entity.OrderStatusHistory;
import com.example.assignment.order.service.OrderStatusService;
import com.example.assignment.shared.dto.ApiResponse;
import com.example.assignment.shared.enums.OrderStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * FR-10: Order Status Management — admin routes.
 */
@Tag(name = "Order Status (Admin)", description = "FR-10 — Admin APIs to drive order lifecycle and query status history")
@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class OrderStatusController {

    private final OrderStatusService orderStatusService;

    @Operation(summary = "Update order status",
               description = """
                       Transitions the order to a new status following the allowed FSM:
                       - PENDING_PAYMENT → PAID | PAYMENT_FAILED | CANCELLED
                       - PAYMENT_FAILED  → PENDING_PAYMENT | CANCELLED
                       - PAID            → CONFIRMED | CANCELLED
                       - CONFIRMED       → PROCESSING | CANCELLED
                       - PROCESSING      → PACKED
                       - PACKED          → SHIPPED
                       - SHIPPED         → DELIVERED | RETURNED
                       - DELIVERED       → RETURNED
                       """)
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Status updated successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status transition"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @Parameter(description = "Order ID", required = true) @PathVariable Long id,
            @Parameter(description = "Target status enum value", required = true) @RequestParam OrderStatus newStatus,
            @Parameter(description = "Who initiated the transition (defaults to ADMIN)") @RequestParam(required = false, defaultValue = "ADMIN") String changedBy,
            @Parameter(description = "Optional note attached to this status event") @RequestParam(required = false) String note) {
        orderStatusService.updateStatus(id, newStatus, changedBy, note);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", null));
    }

    @Operation(summary = "Get order status history",
               description = "Returns the full chronological status audit trail for the given order.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Status history returned"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Order not found")
    })
    @GetMapping("/{id}/status-history")
    public ResponseEntity<ApiResponse<List<OrderStatusHistory>>> getHistory(
            @Parameter(description = "Order ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderStatusService.getHistory(id)));
    }
}


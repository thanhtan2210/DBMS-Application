package com.example.assignment.order.controller;

import com.example.assignment.order.dto.AddCartItemRequest;
import com.example.assignment.order.entity.CartItem;
import com.example.assignment.order.service.CartService;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * FR-05: Cart Management — customer routes.
 */
@Tag(name = "Cart", description = "FR-05 — Customer shopping cart operations")
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Get cart items for a customer",
               description = "Returns all items currently in the customer's active cart.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cart items returned"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItem>>> getCart(
            @Parameter(description = "Customer ID", required = true) @RequestParam Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCartItems(customerId)));
    }

    @Operation(summary = "Add item to cart",
               description = "Adds a product variant with the specified quantity to the customer's cart. " +
                             "If the variant is already in the cart, the quantities are summed.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Item added/updated in cart"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer or variant not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Insufficient stock")
    })
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartItem>> addItem(
            @Parameter(description = "Customer ID", required = true) @RequestParam Long customerId,
            @Valid @RequestBody AddCartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cartService.addItem(customerId, request)));
    }

    @Operation(summary = "Update cart item quantity",
               description = "Updates the quantity of a specific cart item. Quantity must be ≥ 1.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Quantity updated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid quantity"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartItem>> updateQuantity(
            @Parameter(description = "Cart item ID", required = true) @PathVariable Long itemId,
            @Parameter(description = "New quantity (must be ≥ 1)", required = true) @RequestParam Integer quantity) {
        return ResponseEntity.ok(ApiResponse.success(cartService.updateItemQuantity(itemId, quantity)));
    }

    @Operation(summary = "Remove item from cart")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Item removed"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(
            @Parameter(description = "Cart item ID", required = true) @PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed", null));
    }

    @Operation(summary = "Select or deselect a cart item",
               description = "Marks a cart item as selected/deselected for checkout. Only selected items are included in order placement.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Selection updated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cart item not found")
    })
    @PatchMapping("/items/{itemId}/select")
    public ResponseEntity<ApiResponse<Void>> selectItem(
            @Parameter(description = "Cart item ID", required = true) @PathVariable Long itemId,
            @Parameter(description = "true = selected, false = deselected", required = true) @RequestParam Boolean selected) {
        cartService.setItemSelected(itemId, selected);
        return ResponseEntity.ok(ApiResponse.success("Selection updated", null));
    }

    @Operation(summary = "Calculate cart subtotal",
               description = "Computes the subtotal price of all selected items in the given cart.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Subtotal calculated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Cart not found")
    })
    @GetMapping("/subtotal")
    public ResponseEntity<ApiResponse<BigDecimal>> getSubtotal(
            @Parameter(description = "Cart ID", required = true) @RequestParam Long cartId) {
        return ResponseEntity.ok(ApiResponse.success(cartService.calculateSubtotal(cartId)));
    }
}


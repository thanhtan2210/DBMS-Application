package com.example.assignment.order.service;

import com.example.assignment.order.dto.AddCartItemRequest;
import com.example.assignment.order.entity.Cart;
import com.example.assignment.order.entity.CartItem;

import java.math.BigDecimal;
import java.util.List;

public interface CartService {
    Cart getOrCreateActiveCart(Long customerId);
    CartItem addItem(Long customerId, AddCartItemRequest request);
    CartItem updateItemQuantity(Long cartItemId, Integer quantity);
    void removeItem(Long cartItemId);
    void setItemSelected(Long cartItemId, Boolean selected);
    List<CartItem> getCartItems(Long customerId);
    BigDecimal calculateSubtotal(Long cartId);
}

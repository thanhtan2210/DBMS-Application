package com.example.assignment.order.service;

import com.example.assignment.order.dto.AddCartItemRequest;
import com.example.assignment.order.entity.Cart;
import com.example.assignment.order.entity.CartItem;
import com.example.assignment.order.repository.CartItemRepository;
import com.example.assignment.order.repository.CartRepository;
import com.example.assignment.product.entity.Inventory;
import com.example.assignment.product.entity.ProductVariant;
import com.example.assignment.product.repository.InventoryRepository;
import com.example.assignment.product.repository.ProductVariantRepository;
import com.example.assignment.shared.enums.CartStatus;
import com.example.assignment.shared.exception.BusinessRuleViolationException;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import com.example.assignment.user.entity.CustomerProfile;
import com.example.assignment.user.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ProductVariantRepository variantRepository;
    private final InventoryRepository inventoryRepository;

    @Override
    @Transactional
    public Cart getOrCreateActiveCart(Long customerId) {
        return cartRepository.findByCustomer_CustomerIdAndStatus(customerId, CartStatus.ACTIVE)
                .orElseGet(() -> {
                    CustomerProfile profile = customerProfileRepository.findById(customerId)
                            .orElseThrow(() -> new ResourceNotFoundException("Customer", customerId));
                    Cart newCart = Cart.builder()
                            .customer(profile)
                            .status(CartStatus.ACTIVE)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    @Override
    @Transactional
    public CartItem addItem(Long customerId, AddCartItemRequest request) {
        Cart cart = getOrCreateActiveCart(customerId);
        
        // Log để debug xem cart đã có ID chưa
        log.info("Adding item to cart ID: {}", cart.getCartId());

        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", request.getVariantId()));

        if (!"ACTIVE".equals(variant.getStatus())) {
            throw new BusinessRuleViolationException("Variant is not available for purchase");
        }

        // Check available stock
        List<Inventory> inventoryList = inventoryRepository.findByVariant_VariantId(variant.getVariantId());
        int available = inventoryList.stream().mapToInt(Inventory::getAvailableQuantity).sum();
        if (available < request.getQuantity()) {
            throw new BusinessRuleViolationException("Insufficient stock. Available: " + available);
        }

        Optional<CartItem> existing = cartItemRepository.findByCart_CartIdAndVariant_VariantId(
                cart.getCartId(), variant.getVariantId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return cartItemRepository.save(item);
        }

        BigDecimal price = variant.getPriceOverride() != null
                ? variant.getPriceOverride()
                : variant.getProduct().getPrice();

        CartItem newItem = CartItem.builder()
                .cart(cart)
                .variant(variant)
                .quantity(request.getQuantity())
                .unitPrice(price)
                .selectedFlag(true)
                .build();
        return cartItemRepository.save(newItem);
    }

    @Override
    @Transactional
    public CartItem updateItemQuantity(Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", cartItemId));
        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Override
    @Transactional
    public void removeItem(Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", cartItemId));
        cartItemRepository.delete(item);
    }

    @Override
    @Transactional
    public void setItemSelected(Long cartItemId, Boolean selected) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", cartItemId));
        item.setSelectedFlag(selected);
        cartItemRepository.save(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItem> getCartItems(Long customerId) {
        return cartRepository.findByCustomer_CustomerIdAndStatus(customerId, CartStatus.ACTIVE)
                .map(cart -> cartItemRepository.findByCartIdWithDetails(cart.getCartId()))
                .orElse(List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal calculateSubtotal(Long cartId) {
        return cartItemRepository.calculateSubtotal(cartId);
    }
}

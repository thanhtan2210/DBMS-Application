package com.example.assignment.order.service;

import com.example.assignment.analytics.entity.InventoryMovement;
import com.example.assignment.analytics.repository.InventoryMovementRepository;
import com.example.assignment.order.dto.OrderResponse;
import com.example.assignment.order.dto.PlaceOrderRequest;
import com.example.assignment.order.entity.*;
import com.example.assignment.order.repository.*;
import com.example.assignment.product.entity.Inventory;
import com.example.assignment.product.repository.InventoryRepository;
import com.example.assignment.product.repository.ProductVariantRepository;
import com.example.assignment.shared.enums.CartStatus;
import com.example.assignment.shared.enums.MovementType;
import com.example.assignment.shared.exception.BusinessRuleViolationException;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import com.example.assignment.user.entity.Address;
import com.example.assignment.user.entity.CustomerProfile;
import com.example.assignment.user.repository.AddressRepository;
import com.example.assignment.user.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Core transactional flow for FR-03: Order Placement.
 * Uses @Transactional to ensure atomicity across inventory, order, and cart updates.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final AddressRepository addressRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository inventoryMovementRepository;

    @Override
    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {
        CustomerProfile customer = customerProfileRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", request.getCustomerId()));

        Address shippingAddress = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", request.getShippingAddressId()));

        // Load selected cart items
        List<CartItem> selectedItems = cartItemRepository.findAllById(request.getSelectedCartItemIds());
        if (selectedItems.isEmpty()) {
            throw new BusinessRuleViolationException("ORDER_EMPTY", "Order must contain at least one item");
        }

        // Validate and reserve inventory (pessimistic lock applied in repo)
        BigDecimal subtotal = BigDecimal.ZERO;
        List<InventoryMovement> movements = new ArrayList<>();

        for (CartItem item : selectedItems) {
            List<Inventory> inventoryList = inventoryRepository
                    .findByVariantIdWithLock(item.getVariant().getVariantId());
            int totalAvailable = inventoryList.stream().mapToInt(Inventory::getAvailableQuantity).sum();
            if (totalAvailable < item.getQuantity()) {
                throw new BusinessRuleViolationException(
                        "INSUFFICIENT_STOCK",
                        "Insufficient stock for variant: " + item.getVariant().getVariantId()
                                + ". Available: " + totalAvailable + ", Requested: " + item.getQuantity());
            }
            // Reserve from first warehouse that has enough
            int remaining = item.getQuantity();
            for (Inventory inv : inventoryList) {
                if (remaining <= 0) break;
                int reserve = Math.min(remaining, inv.getAvailableQuantity());
                inv.setQuantityReserved(inv.getQuantityReserved() + reserve);
                inventoryRepository.save(inv);

                movements.add(InventoryMovement.builder()
                        .variantId(item.getVariant().getVariantId())
                        .movementType(MovementType.RESERVE)
                        .quantity(reserve)
                        .referenceType("ORDER_DRAFT")
                        .build());
                remaining -= reserve;
            }
            subtotal = subtotal.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        inventoryMovementRepository.saveAll(movements);

        // Create order
        String orderCode = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Order order = Order.builder()
                .customer(customer)
                .orderCode(orderCode)
                .shippingAddress(shippingAddress)
                .subtotalAmount(subtotal)
                .totalAmount(subtotal) // discount/shipping applied later via PromotionService
                .build();
        orderRepository.save(order);

        // Create order items
        List<OrderItem> orderItems = selectedItems.stream().map(ci -> OrderItem.builder()
                .order(order)
                .variant(ci.getVariant())
                .quantity(ci.getQuantity())
                .unitPrice(ci.getUnitPrice())
                .lineTotal(ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .build()
        ).collect(Collectors.toList());
        orderItemRepository.saveAll(orderItems);

        // Remove selected items from cart
        cartItemRepository.deleteAll(selectedItems);

        log.info("Order placed: code={}, customer={}", orderCode, customer.getCustomerId());
        return OrderResponse.from(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(String keyword, Pageable pageable) {
        String searchKeyword = (keyword != null && !keyword.isBlank()) ? "%" + keyword + "%" : null;
        return orderRepository.findByFilters(null, null, null, null, searchKeyword, pageable).map(OrderResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        return OrderResponse.from(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomer_CustomerId(customerId).stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse previewCheckout(PlaceOrderRequest request) {
        List<CartItem> items = cartItemRepository.findAllById(request.getSelectedCartItemIds());
        BigDecimal subtotal = items.stream()
                .map(ci -> ci.getUnitPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order preview = Order.builder()
                .orderCode("PREVIEW")
                .subtotalAmount(subtotal)
                .totalAmount(subtotal)
                .build();
        return OrderResponse.from(preview);
    }
}

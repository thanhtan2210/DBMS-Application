package com.example.assignment.order.service;

import com.example.assignment.order.entity.Order;
import com.example.assignment.order.entity.OrderStatusHistory;
import com.example.assignment.order.repository.OrderRepository;
import com.example.assignment.order.repository.OrderStatusHistoryRepository;
import com.example.assignment.shared.enums.OrderStatus;
import com.example.assignment.shared.exception.BusinessRuleViolationException;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * FR-10: Order Status Management — FSM-based status transition control.
 */
@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository historyRepository;

    // FSM: valid transition map
    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = Map.of(
            OrderStatus.PENDING_PAYMENT, EnumSet.of(OrderStatus.PAID, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED),
            OrderStatus.PAYMENT_FAILED, EnumSet.of(OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED),
            OrderStatus.PAID, EnumSet.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
            OrderStatus.CONFIRMED, EnumSet.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED),
            OrderStatus.PROCESSING, EnumSet.of(OrderStatus.PACKED),
            OrderStatus.PACKED, EnumSet.of(OrderStatus.SHIPPED),
            OrderStatus.SHIPPED, EnumSet.of(OrderStatus.DELIVERED, OrderStatus.RETURNED),
            OrderStatus.DELIVERED, EnumSet.of(OrderStatus.RETURNED),
            OrderStatus.CANCELLED, EnumSet.noneOf(OrderStatus.class),
            OrderStatus.RETURNED, EnumSet.noneOf(OrderStatus.class)
    );

    @Transactional
    public void updateStatus(Long orderId, OrderStatus newStatus, String changedBy, String note) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        OrderStatus current = order.getOrderStatus();
        // Idempotent: no-op if same status
        if (current == newStatus) return;

        Set<OrderStatus> allowed = VALID_TRANSITIONS.getOrDefault(current, EnumSet.noneOf(OrderStatus.class));
        if (!allowed.contains(newStatus)) {
            throw new BusinessRuleViolationException(
                    "INVALID_ORDER_TRANSITION",
                    String.format("Cannot transition order from %s to %s", current, newStatus));
        }

        order.setOrderStatus(newStatus);
        orderRepository.save(order);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .oldStatus(current)
                .newStatus(newStatus)
                .changedBy(changedBy)
                .note(note)
                .build();
        historyRepository.save(history);
    }

    @Transactional(readOnly = true)
    public List<OrderStatusHistory> getHistory(Long orderId) {
        return historyRepository.findByOrder_OrderIdOrderByChangedAtDesc(orderId);
    }
}

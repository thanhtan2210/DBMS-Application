package com.example.assignment.analytics.service;

import com.example.assignment.order.repository.OrderItemRepository;
import com.example.assignment.order.repository.OrderRepository;
import com.example.assignment.payment.repository.PaymentRepository;
import com.example.assignment.shared.enums.OrderStatus;
import com.example.assignment.shared.enums.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * FR-09: Sales Reporting — executes aggregate queries for admin dashboard.
 */
@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getSalesOverview(LocalDateTime from, LocalDateTime to) {
        List<Object[]> results = orderRepository.aggregateRevenueByDateRange(from, to, 
                List.of(OrderStatus.CANCELLED, OrderStatus.PAYMENT_FAILED));
        
        long totalOrders = 0L;
        java.math.BigDecimal grossRevenue = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalDiscount = java.math.BigDecimal.ZERO;

        if (!results.isEmpty()) {
            Object row = results.get(0);
            if (row instanceof Object[]) {
                Object[] agg = (Object[]) row;
                totalOrders = agg.length > 0 && agg[0] != null ? ((Number) agg[0]).longValue() : 0L;
                grossRevenue = agg.length > 1 && agg[1] != null ? (java.math.BigDecimal) agg[1] : java.math.BigDecimal.ZERO;
                totalDiscount = agg.length > 2 && agg[2] != null ? (java.math.BigDecimal) agg[2] : java.math.BigDecimal.ZERO;
            } else if (row instanceof Number) {
                totalOrders = ((Number) row).longValue();
            }
        }
        
        return Map.of(
                "totalOrders", totalOrders,
                "grossRevenue", grossRevenue,
                "totalDiscount", totalDiscount,
                "from", from,
                "to", to
        );
    }

    @Transactional(readOnly = true)
    public List<Object[]> getTopProducts(LocalDateTime from, LocalDateTime to, int limit) {
        return orderItemRepository.topProductsByQuantity(from, to, PageRequest.of(0, limit));
    }

    @Transactional(readOnly = true)
    public List<Object[]> getRevenueByCategory() {
        return paymentRepository.revenueByPaymentMethod(PaymentStatus.SUCCESS);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getOrderCountByStatus() {
        return orderRepository.countByOrderStatus();
    }

    @Transactional(readOnly = true)
    public List<Object[]> getPaymentSuccessRate() {
        return paymentRepository.successRateByPaymentMethod();
    }
}

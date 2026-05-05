package com.example.assignment.promotion.service;

import com.example.assignment.order.entity.Order;
import com.example.assignment.order.repository.OrderRepository;
import com.example.assignment.promotion.dto.PromotionRequest;
import com.example.assignment.promotion.dto.PromotionResponse;
import com.example.assignment.promotion.entity.OrderPromotion;
import com.example.assignment.promotion.entity.Promotion;
import com.example.assignment.promotion.repository.OrderPromotionRepository;
import com.example.assignment.promotion.repository.PromotionRepository;
import com.example.assignment.shared.dto.PageResponse;
import com.example.assignment.shared.enums.DiscountType;
import com.example.assignment.shared.exception.BusinessRuleViolationException;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

/**
 * FR-06: Discounts and Promotions validation and application.
 */
@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final OrderPromotionRepository orderPromotionRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public BigDecimal validateAndCalculateDiscount(String code, BigDecimal orderAmount) {
        Promotion promotion = promotionRepository.findByPromotionCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion", "code", code));

        LocalDateTime now = LocalDateTime.now();
        if (!"ACTIVE".equals(promotion.getStatus())) {
            throw new BusinessRuleViolationException("Promotion is not active");
        }
        if (now.isBefore(promotion.getStartTime()) || now.isAfter(promotion.getEndTime())) {
            throw new BusinessRuleViolationException("Promotion is outside its validity window");
        }
        if (promotion.getUsageLimit() != null && promotion.getUsedCount() >= promotion.getUsageLimit()) {
            throw new BusinessRuleViolationException("Promotion usage limit exceeded");
        }
        if (promotion.getMinimumOrderAmount() != null
                && orderAmount.compareTo(promotion.getMinimumOrderAmount()) < 0) {
            throw new BusinessRuleViolationException(
                    "Order total " + orderAmount + " is below minimum required " + promotion.getMinimumOrderAmount());
        }

        return calculateDiscount(promotion, orderAmount);
    }

    @Transactional
    public void applyPromotionToOrder(Long orderId, String code) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        Promotion promotion = promotionRepository.findByPromotionCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion", "code", code));

        BigDecimal discount = validateAndCalculateDiscount(code, order.getTotalAmount());

        OrderPromotion op = OrderPromotion.builder()
                .order(order)
                .promotion(promotion)
                .discountAmount(discount)
                .build();
        orderPromotionRepository.save(op);

        order.setDiscountAmount(order.getDiscountAmount().add(discount));
        order.setTotalAmount(order.getTotalAmount().subtract(discount));
        orderRepository.save(order);

        promotion.setUsedCount(promotion.getUsedCount() + 1);
        promotionRepository.save(promotion);
    }

    private BigDecimal calculateDiscount(Promotion promotion, BigDecimal orderAmount) {
        BigDecimal discount;
        if (promotion.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = orderAmount.multiply(promotion.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discount = promotion.getDiscountValue();
        }
        if (promotion.getMaxDiscountAmount() != null
                && discount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
            discount = promotion.getMaxDiscountAmount();
        }
        return discount.min(orderAmount);
    }

    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        if (promotionRepository.findByPromotionCode(request.getPromotionCode()).isPresent()) {
            throw new BusinessRuleViolationException("Promotion code already exists");
        }
        Promotion promotion = new Promotion();
        updateEntityFromRequest(promotion, request);
        return PromotionResponse.from(promotionRepository.save(promotion));
    }

    @Transactional
    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion", id));
        updateEntityFromRequest(promotion, request);
        return PromotionResponse.from(promotionRepository.save(promotion));
    }

    @Transactional(readOnly = true)
    public PageResponse<PromotionResponse> listPromotions(Pageable pageable) {
        Page<Promotion> page = promotionRepository.findAll(pageable);
        return PageResponse.from(page.map(PromotionResponse::from));
    }

    @Transactional
    public void deletePromotion(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion", id));
        promotion.setStatus("DELETED");
        promotionRepository.save(promotion);
    }

    private void updateEntityFromRequest(Promotion promotion, PromotionRequest request) {
        promotion.setPromotionCode(request.getPromotionCode());
        promotion.setPromotionName(request.getPromotionName());
        promotion.setDiscountType(request.getDiscountType());
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setMinimumOrderAmount(request.getMinimumOrderAmount());
        promotion.setMaxDiscountAmount(request.getMaxDiscountAmount());
        promotion.setUsageLimit(request.getUsageLimit());
        promotion.setStartTime(request.getStartTime());
        promotion.setEndTime(request.getEndTime());
        promotion.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
    }
}


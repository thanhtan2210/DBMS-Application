package com.example.assignment.promotion.repository;

import com.example.assignment.promotion.entity.OrderPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderPromotionRepository extends JpaRepository<OrderPromotion, Long> {
    List<OrderPromotion> findByOrder_OrderId(Long orderId);
    List<OrderPromotion> findByPromotion_PromotionId(Long promotionId);
}

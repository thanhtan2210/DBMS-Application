package com.example.assignment.promotion.repository;

import com.example.assignment.promotion.entity.PromotionCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionConditionRepository extends JpaRepository<PromotionCondition, Long> {
    List<PromotionCondition> findByPromotion_PromotionId(Long promotionId);
}

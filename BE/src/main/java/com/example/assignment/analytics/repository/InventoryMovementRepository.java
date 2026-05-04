package com.example.assignment.analytics.repository;

import com.example.assignment.analytics.entity.InventoryMovement;
import com.example.assignment.shared.enums.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findByVariantIdAndCreatedAtBetween(Long variantId, LocalDateTime from, LocalDateTime to);
    List<InventoryMovement> findByVariantIdAndMovementType(Long variantId, MovementType type);
}

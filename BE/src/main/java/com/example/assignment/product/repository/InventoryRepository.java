package com.example.assignment.product.repository;

import com.example.assignment.product.entity.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByVariant_VariantIdAndWarehouse_WarehouseId(Long variantId, Long warehouseId);

    List<Inventory> findByVariant_VariantId(Long variantId);

    // FR-03: Pessimistic lock during checkout stock verification
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.variant.variantId = :variantId")
    List<Inventory> findByVariantIdWithLock(@Param("variantId") Long variantId);

    // FR-08: Composite-condition — low-stock items in a given warehouse/category
    @Query("""
            SELECT i FROM Inventory i
            JOIN i.variant v
            JOIN v.product p
            WHERE i.warehouse.warehouseId = :warehouseId
              AND (i.quantityOnHand - i.quantityReserved) <= i.reorderThreshold
              AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
            """)
    List<Inventory> findLowStockByWarehouseAndCategory(
            @Param("warehouseId") Long warehouseId,
            @Param("categoryId") Long categoryId);

    // FR-02: Aggregate — total stock per category
    @Query("""
            SELECT p.category.categoryName, SUM(i.quantityOnHand)
            FROM Inventory i
            JOIN i.variant v
            JOIN v.product p
            GROUP BY p.category.categoryName
            """)
    List<Object[]> totalStockPerCategory();
}

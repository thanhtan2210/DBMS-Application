package com.example.assignment.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory",
    uniqueConstraints = @UniqueConstraint(name = "uc_inventory_variant_warehouse",
            columnNames = {"variant_id", "warehouse_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(name = "quantity_on_hand", nullable = false)
    @Builder.Default
    private Integer quantityOnHand = 0;

    @Column(name = "quantity_reserved", nullable = false)
    @Builder.Default
    private Integer quantityReserved = 0;

    @Column(name = "reorder_threshold", nullable = false)
    @Builder.Default
    private Integer reorderThreshold = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public int getAvailableQuantity() {
        return quantityOnHand - quantityReserved;
    }
}

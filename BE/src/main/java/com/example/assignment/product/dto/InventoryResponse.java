package com.example.assignment.product.dto;

import com.example.assignment.product.entity.Inventory;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryResponse {
    private Long inventoryId;
    private Long variantId;
    private String variantName;
    private String sku;
    private String productName;
    private Long warehouseId;
    private String warehouseName;
    private Integer quantityOnHand;
    private Integer quantityReserved;
    private Integer reorderThreshold;

    public static InventoryResponse from(Inventory inventory) {
        return InventoryResponse.builder()
                .inventoryId(inventory.getInventoryId())
                .variantId(inventory.getVariant().getVariantId())
                .variantName(inventory.getVariant().getVariantName())
                .sku(inventory.getVariant().getProduct().getSku())
                .productName(inventory.getVariant().getProduct().getProductName())
                .warehouseId(inventory.getWarehouse().getWarehouseId())
                .warehouseName(inventory.getWarehouse().getWarehouseName())
                .quantityOnHand(inventory.getQuantityOnHand())
                .quantityReserved(inventory.getQuantityReserved())
                .reorderThreshold(inventory.getReorderThreshold())
                .build();
    }
}

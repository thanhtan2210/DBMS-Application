package com.example.assignment.product.controller;

import com.example.assignment.product.dto.InventoryResponse;
import com.example.assignment.product.entity.Warehouse;
import com.example.assignment.product.repository.InventoryRepository;
import com.example.assignment.product.repository.WarehouseRepository;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Inventory & Warehouse Management")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;

    @GetMapping("/inventory")
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllInventory() {
        List<InventoryResponse> responses = inventoryRepository.findAll().stream()
                .map(InventoryResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Inventory loaded", responses));
    }

    @GetMapping("/warehouses")
    public ResponseEntity<ApiResponse<List<Warehouse>>> getAllWarehouses() {
        return ResponseEntity.ok(ApiResponse.success("Warehouses loaded", warehouseRepository.findAll()));
    }
}

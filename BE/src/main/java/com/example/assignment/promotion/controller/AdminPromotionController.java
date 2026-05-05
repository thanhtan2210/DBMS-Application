package com.example.assignment.promotion.controller;

import com.example.assignment.promotion.dto.PromotionRequest;
import com.example.assignment.promotion.dto.PromotionResponse;
import com.example.assignment.promotion.service.PromotionService;
import com.example.assignment.shared.dto.ApiResponse;
import com.example.assignment.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Admin Promotions", description = "Admin CRUD APIs for Promotions")
@RestController
@RequestMapping("/api/admin/promotions")
@RequiredArgsConstructor
public class AdminPromotionController {

    private final PromotionService promotionService;

    @Operation(summary = "List all promotions")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PromotionResponse>>> listPromotions(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(promotionService.listPromotions(pageable)));
    }

    @Operation(summary = "Create a promotion")
    @PostMapping
    public ResponseEntity<ApiResponse<PromotionResponse>> createPromotion(@Valid @RequestBody PromotionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Promotion created", promotionService.createPromotion(request)));
    }

    @Operation(summary = "Update a promotion")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PromotionResponse>> updatePromotion(@PathVariable Long id, @Valid @RequestBody PromotionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Promotion updated", promotionService.updatePromotion(id, request)));
    }

    @Operation(summary = "Delete a promotion")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.ok(ApiResponse.success("Promotion deleted", null));
    }
}

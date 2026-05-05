package com.example.assignment.product.controller;

import com.example.assignment.product.entity.Brand;
import com.example.assignment.product.repository.BrandRepository;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Brands", description = "Public APIs for browsing brands")
@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class PublicBrandController {

    private final BrandRepository brandRepository;

    @Data
    @Builder
    public static class BrandDto {
        private Long id;
        private String name;
        private String description;
    }

    @Operation(summary = "List active brands")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandDto>>> getBrands() {
        List<BrandDto> list = brandRepository.findByStatus("ACTIVE").stream()
                .map(b -> BrandDto.builder()
                        .id(b.getBrandId())
                        .name(b.getBrandName())
                        .description(b.getDescription())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}

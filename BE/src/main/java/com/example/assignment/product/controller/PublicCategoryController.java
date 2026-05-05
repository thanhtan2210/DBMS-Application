package com.example.assignment.product.controller;

import com.example.assignment.product.entity.Category;
import com.example.assignment.product.repository.CategoryRepository;
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

@Tag(name = "Categories", description = "Public APIs for browsing categories")
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final CategoryRepository categoryRepository;

    @Data
    @Builder
    public static class CategoryDto {
        private Long id;
        private String name;
        private String description;
    }

    @Operation(summary = "List active categories")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        List<CategoryDto> list = categoryRepository.findByStatus("ACTIVE").stream()
                .map(c -> CategoryDto.builder()
                        .id(c.getCategoryId())
                        .name(c.getCategoryName())
                        .description(c.getDescription())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}

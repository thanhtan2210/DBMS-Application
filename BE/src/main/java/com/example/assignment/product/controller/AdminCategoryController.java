package com.example.assignment.product.controller;

import com.example.assignment.product.dto.CategoryRequest;
import com.example.assignment.product.entity.Category;
import com.example.assignment.product.service.CategoryService;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin Categories", description = "Admin APIs for managing categories")
@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.createCategory(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.updateCategory(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted"));
    }
}

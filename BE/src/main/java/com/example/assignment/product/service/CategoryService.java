package com.example.assignment.product.service;

import com.example.assignment.product.dto.CategoryRequest;
import com.example.assignment.product.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category createCategory(CategoryRequest request);
    Category updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
}

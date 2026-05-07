package com.example.assignment.product.dto;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private String description;
    private Long parentCategoryId;
}

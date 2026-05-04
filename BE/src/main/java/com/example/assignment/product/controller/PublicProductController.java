package com.example.assignment.product.controller;

import com.example.assignment.product.dto.ProductResponse;
import com.example.assignment.product.service.ProductService;
import com.example.assignment.shared.dto.ApiResponse;
import com.example.assignment.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public Product API for Storefront (Customers).
 */
@Tag(name = "Storefront Products", description = "Public APIs for browsing and searching products")
@RestController
@RequestMapping("/api/store/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final ProductService productService;

    @Operation(summary = "Search products",
               description = "Returns a paginated list of active products based on search keyword (Semantic Search + ILIKE Fallback), category, and brand.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Paginated product list returned")
    })
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> search(
            @Parameter(description = "Search keyword for product name or description") @RequestParam(required = false) String keyword,
            @Parameter(description = "Filter by category ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Filter by brand ID") @RequestParam(required = false) Long brandId,
            @PageableDefault(size = 20) Pageable pageable) {
        
        return ResponseEntity.ok(ApiResponse.success(
                productService.searchStoreProducts(keyword, categoryId, brandId, pageable)));
    }
}

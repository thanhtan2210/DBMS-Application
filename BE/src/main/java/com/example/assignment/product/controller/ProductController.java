package com.example.assignment.product.controller;

import com.example.assignment.product.dto.CreateProductRequest;
import com.example.assignment.product.dto.EmbeddingJobResponse;
import com.example.assignment.product.dto.ProductResponse;
import com.example.assignment.product.service.ProductService;
import com.example.assignment.shared.dto.ApiResponse;
import com.example.assignment.shared.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * FR-02: Product Management — admin routes.
 */
@Tag(name = "Product Management", description = "FR-02 — Admin APIs for full product lifecycle management")
@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Create a new product",
               description = "Creates a product record with SKU, pricing, brand and category associations.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Product created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error — missing required fields or constraint violations"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "SKU already exists")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", productService.createProduct(request)));
    }

    @Operation(summary = "List products with optional filters",
               description = "Returns a paginated list of products. Supports filtering by category, brand, status and price range.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Paginated product list returned")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> list(
            @Parameter(description = "Filter by category ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Filter by brand ID") @RequestParam(required = false) Long brandId,
            @Parameter(description = "Filter by status: ACTIVE | INACTIVE | DISCONTINUED") @RequestParam(required = false) String status,
            @Parameter(description = "Minimum price (inclusive)") @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price (inclusive)") @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                productService.listProducts(categoryId, brandId, status, minPrice, maxPrice, pageable)));
    }

    @Operation(summary = "Get product by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(
            @Parameter(description = "Product ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    @Operation(summary = "Update product details",
               description = "Full replacement of product fields — requires all mandatory fields.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product updated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @Parameter(description = "Product ID", required = true) @PathVariable Long id,
            @Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product updated", productService.updateProduct(id, request)));
    }

    @Operation(summary = "Deactivate product",
               description = "Marks the product as INACTIVE so it no longer appears in storefront listings.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product deactivated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivate(
            @Parameter(description = "Product ID", required = true) @PathVariable Long id) {
        productService.deactivateProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deactivated", null));
    }

    @Operation(summary = "Delete product",
               description = "Hard-deletes the product record. Use deactivate for safe removal.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Product ID", required = true) @PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }

    // ── Embedding APIs ──────────────────────────────────────────────────────────

    @Operation(
        summary = "Generate embedding for a single product",
        description = "Trigger on-demand embedding generation for a specific product. " +
                      "Uses product name + description as input text for the embedding model (all-MiniLM-L6-v2). " +
                      "Overwrites existing embedding if present."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Embedding job result returned"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    @PostMapping("/{id}/embeddings")
    public ResponseEntity<ApiResponse<EmbeddingJobResponse>> generateEmbedding(
            @Parameter(description = "Product ID", required = true) @PathVariable Long id) {
        EmbeddingJobResponse result = productService.generateEmbeddingForProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Embedding generation triggered", result));
    }

    @Operation(
        summary = "Backfill embeddings — only missing",
        description = "Iterates over all products where search_embedding IS NULL and generates embeddings. " +
                      "Safe to call multiple times — only processes products not yet embedded."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Backfill job completed")
    })
    @PostMapping("/embeddings/backfill")
    public ResponseEntity<ApiResponse<EmbeddingJobResponse>> backfillEmbeddings() {
        EmbeddingJobResponse result = productService.backfillEmbeddings();
        return ResponseEntity.ok(ApiResponse.success("Embedding backfill completed", result));
    }

    @Operation(
        summary = "Regenerate embeddings — all products",
        description = "Re-generates and overwrites embeddings for every non-deleted product. " +
                      "Use this after upgrading the embedding model or changing the text input strategy."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Regeneration job completed")
    })
    @PostMapping("/embeddings/regenerate")
    public ResponseEntity<ApiResponse<EmbeddingJobResponse>> regenerateAllEmbeddings() {
        EmbeddingJobResponse result = productService.regenerateAllEmbeddings();
        return ResponseEntity.ok(ApiResponse.success("Embedding regeneration completed", result));
    }
}

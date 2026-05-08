package com.example.assignment.product.service;

import com.example.assignment.product.dto.CreateProductRequest;
import com.example.assignment.product.dto.EmbeddingJobResponse;
import com.example.assignment.product.dto.ProductResponse;
import com.example.assignment.shared.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductService {
    ProductResponse createProduct(CreateProductRequest request);

    ProductResponse getProductById(Long productId);

    ProductResponse getProductBySku(String sku);

    PageResponse<ProductResponse> listProducts(Long categoryId, Long brandId, String status, BigDecimal minPrice,
            BigDecimal maxPrice, String keyword, Pageable pageable);

    // Customer search — uses Semantic Search with fallback to ILIKE
    PageResponse<ProductResponse> searchStoreProducts(String keyword, Long categoryId, Long brandId,
            BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    ProductResponse updateProduct(Long productId, CreateProductRequest request);

    void deactivateProduct(Long productId);

    void deleteProduct(Long productId);

    // ── Embedding generation ────────────────────────────────────────────────────

    /**
     * Sinh embedding cho 1 sản phẩm cụ thể theo ID.
     */
    EmbeddingJobResponse generateEmbeddingForProduct(Long productId);

    /**
     * Sinh embedding cho tất cả sản phẩm chưa có embedding (NULL).
     * Hữu ích khi import dữ liệu hàng loạt.
     */
    EmbeddingJobResponse backfillEmbeddings();

    /**
     * Tái sinh embedding cho TẤT CẢ sản phẩm (kể cả đã có).
     * Dùng khi thay đổi model hoặc cần sync lại toàn bộ.
     */
    EmbeddingJobResponse regenerateAllEmbeddings();
}

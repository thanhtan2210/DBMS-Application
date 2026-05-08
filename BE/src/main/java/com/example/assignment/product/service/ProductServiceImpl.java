package com.example.assignment.product.service;

import com.example.assignment.product.dto.CreateProductRequest;
import com.example.assignment.product.dto.EmbeddingJobResponse;
import com.example.assignment.product.dto.ProductResponse;
import com.example.assignment.product.entity.Brand;
import com.example.assignment.product.entity.Category;
import com.example.assignment.product.entity.Product;
import com.example.assignment.product.entity.ProductVariant;
import com.example.assignment.product.repository.BrandRepository;
import com.example.assignment.product.repository.CategoryRepository;
import com.example.assignment.product.repository.InventoryRepository;
import com.example.assignment.product.repository.ProductRepository;
import com.example.assignment.product.repository.ProductVariantRepository;
import com.example.assignment.shared.exception.DuplicateResourceException;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import com.example.assignment.shared.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import dev.langchain4j.model.embedding.EmbeddingModel;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;
    private final InventoryRepository inventoryRepository;
    private final EmbeddingModel embeddingModel;

    // ── Private helpers ─────────────────────────────────────────────────────────

    private String generateEmbedding(String text) {
        if (text == null || text.isBlank())
            return null;
        try {
            float[] vector = embeddingModel.embed(text).content().vector();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < vector.length; i++) {
                sb.append(vector[i]);
                if (i < vector.length - 1)
                    sb.append(",");
            }
            sb.append("]");
            return sb.toString();
        } catch (Exception e) {
            log.warn("Failed to generate embedding for text: {}", e.getMessage());
            return null;
        }
    }

    private String buildEmbeddingText(Product product) {
        String name = product.getProductName() != null ? product.getProductName() : "";
        String desc = product.getDescription() != null ? product.getDescription() : "";
        return (name + " " + desc).trim();
    }

    /**
     * Sinh embedding cho một product và persist ngay. Trả về true nếu thành công.
     */
    private boolean embedAndSave(Product product) {
        try {
            String embeddingStr = generateEmbedding(buildEmbeddingText(product));
            if (embeddingStr == null)
                return false;
            productRepository.updateProductEmbedding(product.getProductId(), embeddingStr);
            return true;
        } catch (Exception e) {
            log.warn("Failed to save embedding for product ID {}: {}", product.getProductId(), e.getMessage());
            return false;
        }
    }

    // ── CRUD ────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product", "sku", request.getSku());
        }

        Brand brand = request.getBrandId() != null
                ? brandRepository.findById(request.getBrandId())
                        .orElseThrow(() -> new ResourceNotFoundException("Brand", request.getBrandId()))
                : null;

        Category category = request.getCategoryId() != null
                ? categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()))
                : null;

        Product product = Product.builder()
                .sku(request.getSku())
                .productName(request.getProductName())
                .brand(brand)
                .category(category)
                .description(request.getDescription())
                .price(request.getPrice())
                .costPrice(request.getCostPrice())
                .imageUrl(request.getImageUrl())
                .status("ACTIVE")
                .build();

        productRepository.save(product);

        if (request.getVariants() != null) {
            List<ProductVariant> variants = request.getVariants().stream().map(v -> ProductVariant.builder()
                    .product(product)
                    .variantName(v.getVariantName())
                    .color(v.getColor())
                    .size(v.getSize())
                    .priceOverride(v.getPriceOverride())
                    .barcode(v.getBarcode())
                    .imageUrl(v.getImageUrl())
                    .status("ACTIVE")
                    .build()).collect(Collectors.toList());
            variantRepository.saveAll(variants);
        }

        log.info("Created product: sku={}", product.getSku());

        embedAndSave(product);

        return ProductResponse.from(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findByIdWithDetails(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        return ProductResponse.from(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", sku));
        return ProductResponse.from(product);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> listProducts(Long categoryId, Long brandId, String status,
            BigDecimal minPrice, BigDecimal maxPrice, String keyword, Pageable pageable) {
        return PageResponse.from(
                productRepository.findByFilters(categoryId, brandId, status, minPrice, maxPrice, keyword, pageable)
                        .map(ProductResponse::from));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> searchStoreProducts(String keyword, Long categoryId, Long brandId,
            Pageable pageable) {
        if (keyword != null && !keyword.isBlank()) {
            try {
                String vectorStr = generateEmbedding(keyword);
                if (vectorStr != null) {
                    org.springframework.data.domain.Page<Product> semanticResults = productRepository
                            .searchStoreProductsSemantic(vectorStr, categoryId, brandId, pageable);

                    // Nếu tìm kiếm theo Vector có kết quả, trả về ngay
                    if (semanticResults.hasContent()) {
                        return PageResponse.from(semanticResults.map(ProductResponse::from));
                    }
                }
            } catch (Exception e) {
                log.warn("Semantic search failed, falling back to ILIKE: {}", e.getMessage());
            }
        }

        // Fallback: Tìm kiếm theo kiểu truyền thống (LIKE) nếu Vector search không ra
        // hoặc không có keyword
        return PageResponse.from(
                productRepository.searchStoreProductsIlike(keyword, categoryId, brandId, pageable)
                        .map(ProductResponse::from));
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long productId, CreateProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (request.getProductName() != null)
            product.setProductName(request.getProductName());
        if (request.getPrice() != null)
            product.setPrice(request.getPrice());
        if (request.getCostPrice() != null)
            product.setCostPrice(request.getCostPrice());
        if (request.getDescription() != null)
            product.setDescription(request.getDescription());
        if (request.getImageUrl() != null)
            product.setImageUrl(request.getImageUrl());

        if (request.getBrandId() != null) {
            product.setBrand(brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand", request.getBrandId())));
        }
        if (request.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId())));
        }

        productRepository.save(product);
        embedAndSave(product);

        return ProductResponse.from(product);
    }

    @Override
    @Transactional
    public void deactivateProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        product.setStatus("INACTIVE");
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        product.softDelete();
        productRepository.save(product);
    }

    // ── Embedding APIs ──────────────────────────────────────────────────────────

    @Override
    @Transactional
    public EmbeddingJobResponse generateEmbeddingForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        boolean ok = embedAndSave(product);
        log.info("[Embedding] product_id={} → {}", productId, ok ? "OK" : "FAILED");

        return EmbeddingJobResponse.builder()
                .total(1)
                .succeeded(ok ? 1 : 0)
                .failed(ok ? 0 : 1)
                .summary(ok
                        ? "Embedding generated successfully for product " + productId
                        : "Failed to generate embedding for product " + productId)
                .build();
    }

    @Override
    @Transactional
    public EmbeddingJobResponse backfillEmbeddings() {
        List<Product> products = productRepository.findAllMissingEmbedding();
        log.info("[Embedding Backfill] Found {} products without embedding", products.size());
        return processEmbeddingJob(products, "Backfill");
    }

    @Override
    @Transactional
    public EmbeddingJobResponse regenerateAllEmbeddings() {
        List<Product> products = productRepository.findAllActive();
        log.info("[Embedding Regenerate] Processing {} products", products.size());
        return processEmbeddingJob(products, "Regenerate");
    }

    /** Xử lý embedding batch, tiếp tục dù từng item lỗi. */
    private EmbeddingJobResponse processEmbeddingJob(List<Product> products, String jobType) {
        int succeeded = 0;
        int failed = 0;

        for (Product product : products) {
            boolean ok = embedAndSave(product);
            if (ok) {
                succeeded++;
                log.debug("[Embedding {}] product_id={} → OK", jobType, product.getProductId());
            } else {
                failed++;
                log.warn("[Embedding {}] product_id={} → FAILED", jobType, product.getProductId());
            }
        }

        log.info("[Embedding {}] Done: total={}, succeeded={}, failed={}", jobType, products.size(), succeeded, failed);

        return EmbeddingJobResponse.builder()
                .total(products.size())
                .succeeded(succeeded)
                .failed(failed)
                .summary(String.format("%s complete: %d/%d products processed successfully",
                        jobType, succeeded, products.size()))
                .build();
    }
}

package com.example.assignment.product.repository;

import com.example.assignment.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

        // FR-02: Single-condition query — find by SKU
        Optional<Product> findBySku(String sku);

        boolean existsBySku(String sku);

        // FR-02: Composite-condition query — by category + status + price range
        @Query("""
                        SELECT DISTINCT p FROM Product p
                        LEFT JOIN p.variants v
                        WHERE (:categoryId IS NULL OR p.category.categoryId = :categoryId)
                          AND (:brandId IS NULL OR p.brand.brandId = :brandId)
                          AND (:status IS NULL OR p.status = :status)
                          AND (:minPrice IS NULL OR p.price >= :minPrice)
                          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                          AND (:keyword IS NULL OR (LOWER(p.productName) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
                               OR LOWER(p.sku) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
                               OR LOWER(v.barcode) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))))
                          AND p.deletedAt IS NULL
                        """)
        Page<Product> findByFilters(
                        @Param("categoryId") Long categoryId,
                        @Param("brandId") Long brandId,
                        @Param("status") String status,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        @Param("keyword") String keyword,
                        Pageable pageable);

        // FR-02: Join query — products with brand, category, inventory
        @Query("""
                        SELECT p FROM Product p
                        JOIN FETCH p.brand b
                        JOIN FETCH p.category c
                        WHERE p.productId = :id AND p.deletedAt IS NULL
                        """)
        Optional<Product> findByIdWithDetails(@Param("id") Long id);

        // FR-02: Subquery — products priced above average in their category
        @Query("""
                        SELECT p FROM Product p
                        WHERE p.price > (
                            SELECT AVG(p2.price) FROM Product p2
                            WHERE p2.category.categoryId = p.category.categoryId
                              AND p2.deletedAt IS NULL
                        )
                        AND p.deletedAt IS NULL
                        """)
        List<Product> findAboveAveragePriceInCategory();

        // FR-02: Aggregate — average price per brand
        @Query("SELECT p.brand.brandName, AVG(p.price) FROM Product p WHERE p.deletedAt IS NULL GROUP BY p.brand.brandName")
        List<Object[]> avgPricePerBrand();

        // FR-02: Aggregate — stock count per category (requires inventory join)
        @Query("""
                        SELECT p.category.categoryName, SUM(i.quantityOnHand)
                        FROM Product p
                        JOIN ProductVariant v ON v.product = p
                        JOIN Inventory i ON i.variant = v
                        WHERE p.deletedAt IS NULL
                        GROUP BY p.category.categoryName
                        """)
        List<Object[]> stockCountPerCategory();

        @Modifying
        @Query(value = "UPDATE products SET search_embedding = cast(:embedding as vector) WHERE product_id = :id", nativeQuery = true)
        void updateProductEmbedding(@Param("id") Long id, @Param("embedding") String embedding);

        @Query("""
                        SELECT p FROM Product p
                        WHERE (:categoryId IS NULL OR p.category.categoryId = :categoryId)
                          AND (:brandId IS NULL OR p.brand.brandId = :brandId)
                          AND (:minPrice IS NULL OR p.price >= :minPrice)
                          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                          AND (:keyword IS NULL OR (LOWER(p.productName) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
                               OR LOWER(p.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))))
                          AND p.status = 'ACTIVE'
                          AND p.deletedAt IS NULL
                        """)
        Page<Product> searchStoreProductsIlike(
                        @Param("keyword") String keyword,
                        @Param("categoryId") Long categoryId,
                        @Param("brandId") Long brandId,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        Pageable pageable);

        @Query(value = """
                        SELECT *, (p.search_embedding <=> cast(:embedding as vector)) as distance
                        FROM products p
                        WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
                          AND (:brandId IS NULL OR p.brand_id = :brandId)
                          AND (:minPrice IS NULL OR p.price >= :minPrice)
                          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                          AND p.status = 'ACTIVE'
                          AND p.deleted_at IS NULL
                          AND (:embedding IS NULL OR (p.search_embedding <=> cast(:embedding as vector)) < 0.5)
                        ORDER BY distance ASC
                        """, countQuery = """
                        SELECT count(*) FROM products p
                        WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
                          AND (:brandId IS NULL OR p.brand_id = :brandId)
                          AND (:minPrice IS NULL OR p.price >= :minPrice)
                          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                          AND p.status = 'ACTIVE'
                          AND p.deleted_at IS NULL
                          AND (:embedding IS NULL OR (p.search_embedding <=> cast(:embedding as vector)) < 0.5)
                        """, nativeQuery = true)
        Page<Product> searchStoreProductsSemantic(
                        @Param("embedding") String embedding,
                        @Param("categoryId") Long categoryId,
                        @Param("brandId") Long brandId,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        Pageable pageable);

        // Embedding backfill: lấy tất cả sản phẩm chưa có embedding
        @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL AND p.searchEmbedding IS NULL")
        List<Product> findAllMissingEmbedding();

        // Embedding regenerate: lấy tất cả sản phẩm không bị xoá
        @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL")
        List<Product> findAllActive();
}

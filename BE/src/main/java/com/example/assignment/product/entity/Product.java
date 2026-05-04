package com.example.assignment.product.entity;

import com.example.assignment.shared.entity.BaseAuditEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_sku", columnList = "sku", unique = true),
        @Index(name = "idx_products_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "sku", nullable = false, unique = true, length = 100)
    private String sku;

    @Column(name = "product_name", nullable = false, length = 500)
    private String productName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "cost_price", precision = 15, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";

    /**
     * Vector embedding cho semantic search.
     * Được lưu dưới dạng text "[x1,x2,...]" và cast sang kiểu vector của pgvector
     * thông qua native query trong ProductRepository.
     * Giá trị null = chưa generate embedding.
     */
    @Column(name = "search_embedding", columnDefinition = "vector(384)", insertable = false, updatable = false)
    private String searchEmbedding;
}

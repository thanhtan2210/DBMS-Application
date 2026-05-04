package com.example.assignment.product.repository;

import com.example.assignment.product.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProduct_ProductId(Long productId);
    Optional<ProductVariant> findByBarcode(String barcode);
    boolean existsByBarcode(String barcode);
    List<ProductVariant> findByProduct_ProductIdAndStatus(Long productId, String status);
}

package com.example.assignment.product.repository;

import com.example.assignment.product.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByBrandName(String brandName);
    boolean existsByBrandName(String brandName);
    List<Brand> findByStatus(String status);
}

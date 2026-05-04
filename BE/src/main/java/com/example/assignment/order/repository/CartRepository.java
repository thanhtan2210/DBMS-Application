package com.example.assignment.order.repository;

import com.example.assignment.order.entity.Cart;
import com.example.assignment.shared.enums.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // FR-05: Single-condition — cart by customer
    Optional<Cart> findByCustomer_CustomerIdAndStatus(Long customerId, CartStatus status);

    Optional<Cart> findByCustomer_CustomerId(Long customerId);
}

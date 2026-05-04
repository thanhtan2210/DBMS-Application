package com.example.assignment.order.repository;

import com.example.assignment.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart_CartId(Long cartId);

    // FR-05: Composite-condition — active selected items in a cart
    List<CartItem> findByCart_CartIdAndSelectedFlag(Long cartId, Boolean selectedFlag);

    Optional<CartItem> findByCart_CartIdAndVariant_VariantId(Long cartId, Long variantId);

    // FR-05: Aggregate — subtotal for selected items
    @Query("""
            SELECT COALESCE(SUM(ci.unitPrice * ci.quantity), 0)
            FROM CartItem ci
            WHERE ci.cart.cartId = :cartId AND ci.selectedFlag = true
            """)
    BigDecimal calculateSubtotal(@Param("cartId") Long cartId);

    // FR-05: Join query — cart items with variant and product details
    @Query("""
            SELECT ci FROM CartItem ci
            JOIN FETCH ci.variant v
            JOIN FETCH v.product p
            WHERE ci.cart.cartId = :cartId
            """)
    List<CartItem> findByCartIdWithDetails(@Param("cartId") Long cartId);
}

package com.example.assignment.user.repository;

import com.example.assignment.user.entity.CustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {

    Optional<CustomerProfile> findByUser_UserId(Long userId);

    // FR-01: Join query — customers with city and status filter
    @Query("""
            SELECT cp FROM CustomerProfile cp
            JOIN cp.user u
            LEFT JOIN Address a ON a.user = u AND a.isDefault = true
            WHERE (:city IS NULL OR a.city = :city)
              AND (:status IS NULL OR u.status = :status)
              AND u.deletedAt IS NULL
            """)
    Page<CustomerProfile> findByFilters(
            @Param("city") String city,
            @Param("status") String status,
            Pageable pageable);

    // FR-01: Join query — full profile with user + address
    @Query("""
            SELECT cp FROM CustomerProfile cp
            JOIN FETCH cp.user u
            WHERE cp.customerId = :id AND u.deletedAt IS NULL
            """)
    Optional<CustomerProfile> findByIdWithUser(@Param("id") Long id);
}

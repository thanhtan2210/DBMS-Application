package com.example.assignment.user.repository;

import com.example.assignment.shared.enums.UserStatus;
import com.example.assignment.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // FR-01: Single-condition query — find customer by email
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    // FR-01: Composite-condition query — customers by city filter (handled via profile join)
    // FR-01: Find by status
    Page<User> findByStatus(UserStatus status, Pageable pageable);

    // FR-01: Composite - status + created range
    Page<User> findByStatusAndCreatedAtBetween(UserStatus status, LocalDateTime from, LocalDateTime to, Pageable pageable);

    // FR-01: Aggregate — count customers by status
    @Query("SELECT u.status, COUNT(u) FROM User u GROUP BY u.status")
    java.util.List<Object[]> countByStatus();

    // Soft delete exclusion — return only non-deleted
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND u.email = :email")
    Optional<User> findActiveByEmail(@Param("email") String email);
}

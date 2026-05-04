package com.example.assignment.shared.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Extends BaseEntity with soft-delete support.
 * Entities extending this class should use WHERE deleted_at IS NULL in queries.
 */
@Getter
@Setter
@MappedSuperclass
public abstract class BaseAuditEntity extends BaseEntity {

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}

package com.example.assignment.analytics.entity;

import com.example.assignment.shared.enums.EventType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_events", indexes = {
        @Index(name = "idx_user_events_type", columnList = "event_type"),
        @Index(name = "idx_user_events_time", columnList = "event_time"),
        @Index(name = "idx_user_events_product", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 30)
    private EventType eventType;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "variant_id")
    private Long variantId;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    @PrePersist
    protected void onCreate() {
        if (this.eventTime == null) {
            this.eventTime = LocalDateTime.now();
        }
    }
}

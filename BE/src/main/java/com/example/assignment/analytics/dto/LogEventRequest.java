package com.example.assignment.analytics.dto;

import com.example.assignment.shared.enums.EventType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LogEventRequest {

    private Long userId;

    private String sessionId;

    @NotNull
    private EventType eventType;

    private Long productId;
    private Long variantId;
    private String metadataJson;
    private LocalDateTime eventTime;
}

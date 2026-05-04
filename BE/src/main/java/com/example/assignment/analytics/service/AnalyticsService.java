package com.example.assignment.analytics.service;

import com.example.assignment.analytics.dto.LogEventRequest;
import com.example.assignment.analytics.entity.UserEvent;
import com.example.assignment.analytics.repository.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserEventRepository userEventRepository;

    @Transactional
    public UserEvent logEvent(LogEventRequest request) {
        UserEvent event = UserEvent.builder()
                .userId(request.getUserId())
                .sessionId(request.getSessionId())
                .eventType(request.getEventType())
                .productId(request.getProductId())
                .variantId(request.getVariantId())
                .metadataJson(request.getMetadataJson())
                .eventTime(request.getEventTime() != null ? request.getEventTime() : LocalDateTime.now())
                .build();
        return userEventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getConversionFunnel(LocalDateTime from, LocalDateTime to) {
        return userEventRepository.funnelAggregation(from, to);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getTopViewedProducts(LocalDateTime from, LocalDateTime to, org.springframework.data.domain.Pageable pageable) {
        return userEventRepository.topViewedProducts(from, to, pageable);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getProductsAboveAverageCartAdd(LocalDateTime from, LocalDateTime to) {
        return userEventRepository.productsAboveAverageCartAddRate(from, to);
    }
}

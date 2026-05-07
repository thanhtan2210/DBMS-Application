package com.example.assignment.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogisticsConfigResponse {
    private Map<String, Boolean> activeCarriers;
    private java.util.List<RegionalRule> regionalRules;

    @Data
    @AllArgsConstructor
    public static class RegionalRule {
        private String region;
        private String status;
        private String cost;
    }
}

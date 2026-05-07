package com.example.assignment.order.service;

import com.example.assignment.order.dto.LogisticsConfigResponse;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class LogisticsConfigService {

    // Mock storage in-memory since we can't add tables
    private Map<String, Boolean> carriers = new HashMap<>(Map.of(
        "fedex", true,
        "ups", true,
        "dhl", false
    ));

    public LogisticsConfigResponse getConfig() {
        return LogisticsConfigResponse.builder()
            .activeCarriers(carriers)
            .regionalRules(List.of(
                new LogisticsConfigResponse.RegionalRule("North America", "Optimal", "$12.40 avg"),
                new LogisticsConfigResponse.RegionalRule("Europe (SEPA)", "High Volume", "€14.20 avg"),
                new LogisticsConfigResponse.RegionalRule("Southeast Asia", "Optimal", "$8.50 avg")
            ))
            .build();
    }

    public String optimizeRoutes() {
        // Simulation of a heavy algorithm
        return "Route optimization completed. 12% CO2 reduction achieved. Speed boost +18h.";
    }

    public String generateLabels(List<String> orderCodes) {
        return "Generated " + orderCodes.size() + " shipping labels successfully.";
    }

    public List<Map<String, Object>> getCarrierPerformance() {
        return List.of(
            Map.of("name", "FedEx Express", "status", 98, "trend", "+2%"),
            Map.of("name", "UPS Logistics", "status", 94, "trend", "-1%"),
            Map.of("name", "DHL Global", "status", 96, "trend", "+4%")
        );
    }

    public void updateCarriers(Map<String, Boolean> newCarriers) {
        this.carriers.putAll(newCarriers);
    }
}

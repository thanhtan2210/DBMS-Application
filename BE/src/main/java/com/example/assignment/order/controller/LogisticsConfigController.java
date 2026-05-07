package com.example.assignment.order.controller;

import com.example.assignment.order.dto.LogisticsConfigResponse;
import com.example.assignment.order.service.LogisticsConfigService;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@Tag(name = "Admin Logistics Config", description = "Endpoints for managing logistics carriers and rules")
@RestController
@RequestMapping("/api/admin/logistics/config")
@RequiredArgsConstructor
public class LogisticsConfigController {

    private final LogisticsConfigService logisticsConfigService;

    @GetMapping
    public ResponseEntity<ApiResponse<LogisticsConfigResponse>> getConfig() {
        return ResponseEntity.ok(ApiResponse.success(logisticsConfigService.getConfig()));
    }

    @PutMapping("/carriers")
    public ResponseEntity<ApiResponse<String>> updateCarriers(@RequestBody Map<String, Boolean> carriers) {
        logisticsConfigService.updateCarriers(carriers);
        return ResponseEntity.ok(ApiResponse.success("Carriers updated successfully"));
    }

    @PostMapping("/optimize")
    public ResponseEntity<ApiResponse<String>> optimize() {
        return ResponseEntity.ok(ApiResponse.success(logisticsConfigService.optimizeRoutes()));
    }

    @PostMapping("/labels")
    public ResponseEntity<ApiResponse<String>> generateLabels(@RequestBody java.util.List<String> orderCodes) {
        return ResponseEntity.ok(ApiResponse.success(logisticsConfigService.generateLabels(orderCodes)));
    }

    @GetMapping("/performance")
    public ResponseEntity<ApiResponse<java.util.List<java.util.Map<String, Object>>>> getPerformance() {
        return ResponseEntity.ok(ApiResponse.success(logisticsConfigService.getCarrierPerformance()));
    }
}

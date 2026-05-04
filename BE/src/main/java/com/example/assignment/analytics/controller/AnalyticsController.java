package com.example.assignment.analytics.controller;

import com.example.assignment.analytics.dto.LogEventRequest;
import com.example.assignment.analytics.entity.ForecastSnapshot;
import com.example.assignment.analytics.entity.UserEvent;
import com.example.assignment.analytics.service.AnalyticsService;
import com.example.assignment.analytics.service.ForecastService;
import com.example.assignment.analytics.service.ReportService;
import com.example.assignment.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * FR-07: Analytics | FR-08: Forecasting | FR-09: Sales Reporting — admin routes.
 */
@Tag(name = "Analytics & Reporting (Admin)",
     description = "FR-07 Event tracking, FR-08 Demand forecasting, FR-09 Sales reports — all admin-only")
@RestController
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ForecastService forecastService;
    private final ReportService reportService;

    // ─── FR-07: Event Tracking ────────────────────────────────────────────────

    @Operation(summary = "Log a user event",
               description = "Persists a user behavioural event (e.g. VIEW_PRODUCT, ADD_TO_CART, PURCHASE). " +
                             "Call this from the frontend on every meaningful user interaction.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Event logged successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error — eventType is required")
    })
    @PostMapping("/api/events")
    public ResponseEntity<ApiResponse<UserEvent>> logEvent(@Valid @RequestBody LogEventRequest request) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.logEvent(request)));
    }

    @Operation(summary = "Get conversion funnel (admin)",
               description = "Returns aggregated event counts per event type within the date window, " +
                             "ordered to represent the VIEW → CART → CHECKOUT → PURCHASE conversion funnel.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Funnel data returned — array of [eventType, count] tuples")
    })
    @GetMapping("/api/admin/analytics/funnel")
    public ResponseEntity<ApiResponse<List<Object[]>>> getFunnel(
            @Parameter(description = "Start of the analysis window (ISO-8601 datetime, e.g. 2025-01-01T00:00:00)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @Parameter(description = "End of the analysis window (ISO-8601 datetime)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getConversionFunnel(from, to)));
    }

    @Operation(summary = "Get top viewed products (admin)",
               description = "Returns the N most frequently viewed products in the given date window. " +
                             "Use the `limit` parameter to control the result size (default 10).")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Top products returned — array of [productId, viewCount] tuples")
    })
    @GetMapping("/api/admin/analytics/top-products")
    public ResponseEntity<ApiResponse<List<Object[]>>> getTopProducts(
            @Parameter(description = "Start datetime (ISO-8601)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @Parameter(description = "End datetime (ISO-8601)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @Parameter(description = "Maximum number of products to return (default: 10)")
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTopViewedProducts(from, to, PageRequest.of(0, limit))));
    }

    // ─── FR-08: Demand Forecasting ────────────────────────────────────────────

    @Operation(summary = "Run demand forecast (admin)",
               description = "Triggers a demand forecast computation for the given date. The algorithm analyses " +
                             "`lookbackDays` of historical sales data and stores/updates ForecastSnapshot records. " +
                             "Returns the newly computed snapshots.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Forecast computed and stored — list of ForecastSnapshot records returned"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid date or lookback window")
    })
    @PostMapping("/api/admin/forecast/run")
    public ResponseEntity<ApiResponse<List<ForecastSnapshot>>> runForecast(
            @Parameter(description = "Reference date for the forecast (ISO-8601 date, e.g. 2025-06-01)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate forecastDate,
            @Parameter(description = "Number of past days to use as training data (default: 30)")
            @RequestParam(defaultValue = "30") int lookbackDays) {
        return ResponseEntity.ok(ApiResponse.success(forecastService.runForecast(forecastDate, lookbackDays)));
    }

    @Operation(summary = "Get stored forecast for a date (admin)",
               description = "Returns the previously computed ForecastSnapshot records for the given date. " +
                             "Run forecast first if no data exists.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Forecast snapshots returned (may be empty if forecast not yet run)")
    })
    @GetMapping("/api/admin/forecast")
    public ResponseEntity<ApiResponse<List<ForecastSnapshot>>> getForecast(
            @Parameter(description = "Reference date (ISO-8601 date)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate forecastDate) {
        return ResponseEntity.ok(ApiResponse.success(forecastService.getForecast(forecastDate)));
    }

    // ─── FR-09: Sales Reporting ───────────────────────────────────────────────

    @Operation(summary = "Get sales overview report (admin)",
               description = "Returns aggregate sales KPIs for the given period: total orders, total revenue, " +
                             "average order value, and number of unique customers.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Sales overview map returned")
    })
    @GetMapping("/api/admin/reports/sales-overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesOverview(
            @Parameter(description = "Start of the reporting period (ISO-8601 datetime)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @Parameter(description = "End of the reporting period (ISO-8601 datetime)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getSalesOverview(from, to)));
    }

    @Operation(summary = "Get top products by sales revenue (admin)",
               description = "Returns the N best-selling products by revenue within the reporting window. " +
                             "Result is an array of [productId, productName, totalRevenue] tuples.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Top products by revenue returned")
    })
    @GetMapping("/api/admin/reports/top-products")
    public ResponseEntity<ApiResponse<List<Object[]>>> getTopSalesProducts(
            @Parameter(description = "Start datetime (ISO-8601)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @Parameter(description = "End datetime (ISO-8601)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @Parameter(description = "Maximum number of products to return (default: 10)")
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getTopProducts(from, to, limit)));
    }

    @Operation(summary = "Get revenue breakdown by category (admin)",
               description = "Returns total revenue grouped by product category " +
                             "(internally proxied via payment method aggregation). " +
                             "Result is an array of [category, totalRevenue] tuples.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Revenue by category returned")
    })
    @GetMapping("/api/admin/reports/revenue-by-category")
    public ResponseEntity<ApiResponse<List<Object[]>>> getRevenueByCategory() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getRevenueByCategory()));
    }
}

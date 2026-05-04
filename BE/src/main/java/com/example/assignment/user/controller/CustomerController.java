package com.example.assignment.user.controller;

import com.example.assignment.shared.dto.ApiResponse;
import com.example.assignment.shared.dto.PageResponse;
import com.example.assignment.user.dto.CreateCustomerRequest;
import com.example.assignment.user.dto.CustomerResponse;
import com.example.assignment.user.dto.UpdateCustomerRequest;
import com.example.assignment.user.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * FR-01: Customer Management — admin routes.
 */
@Tag(name = "Customer Management", description = "FR-01 — Admin APIs to create, read, update and deactivate customers")
@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @Operation(summary = "Create a new customer",
               description = "Registers a new customer account together with an optional default shipping address.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Customer created successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error — missing or invalid fields"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Email already registered")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> create(@Valid @RequestBody CreateCustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Customer created", response));
    }

    @Operation(summary = "List customers with optional filters",
               description = "Returns a paginated list of customers. Supports filtering by city and account status.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Page of customers returned")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CustomerResponse>>> list(
            @Parameter(description = "Filter by city name (case-insensitive partial match)")
            @RequestParam(required = false) String city,
            @Parameter(description = "Filter by account status: ACTIVE | INACTIVE | BANNED")
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(customerService.listCustomers(city, status, pageable)));
    }

    @Operation(summary = "Get customer by ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getById(
            @Parameter(description = "Customer ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomerById(id)));
    }

    @Operation(summary = "Update customer profile",
               description = "Partially updates fullName, email, phone, dateOfBirth, gender, or status.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer updated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> update(
            @Parameter(description = "Customer ID", required = true) @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Customer updated", customerService.updateCustomer(id, request)));
    }

    @Operation(summary = "Deactivate customer account",
               description = "Sets the customer status to INACTIVE. The account can be reactivated later.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer deactivated"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> deactivate(
            @Parameter(description = "Customer ID", required = true) @PathVariable Long id) {
        customerService.deactivateCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deactivated", null));
    }

    @Operation(summary = "Permanently delete customer",
               description = "Hard-deletes the customer record. Use deactivate instead for soft-delete.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer deleted"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Customer ID", required = true) @PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted", null));
    }
}


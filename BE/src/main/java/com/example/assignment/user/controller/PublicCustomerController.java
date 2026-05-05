package com.example.assignment.user.controller;

import com.example.assignment.shared.dto.ApiResponse;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import com.example.assignment.user.dto.CustomerResponse;
import com.example.assignment.user.dto.UpdateCustomerRequest;
import com.example.assignment.user.entity.Address;
import com.example.assignment.user.entity.CustomerProfile;
import com.example.assignment.user.repository.AddressRepository;
import com.example.assignment.user.repository.CustomerProfileRepository;
import com.example.assignment.user.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Customer Public API", description = "Public APIs for customer information")
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class PublicCustomerController {

    private final CustomerProfileRepository customerProfileRepository;
    private final AddressRepository addressRepository;
    private final CustomerService customerService;

    @Data
    @Builder
    public static class AddressDto {
        private Long addressId;
        private String receiverName;
        private String phone;
        private String street;
        private String ward;
        private String district;
        private String city;
        private String country;
        private String postalCode;
        private Boolean isDefault;
    }

    @Operation(summary = "Get customer addresses")
    @GetMapping("/{id}/addresses")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getCustomerAddresses(@PathVariable Long id) {
        CustomerProfile customer = customerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));

        List<AddressDto> addresses = addressRepository.findByUser_UserId(customer.getUser().getUserId())
                .stream().map(a -> AddressDto.builder()
                        .addressId(a.getAddressId())
                        .receiverName(a.getReceiverName())
                        .phone(a.getPhone())
                        .street(a.getStreet())
                        .ward(a.getWard())
                        .district(a.getDistrict())
                        .city(a.getCity())
                        .country(a.getCountry())
                        .postalCode(a.getPostalCode())
                        .isDefault(a.getIsDefault())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved", addresses));
    }

    @Operation(summary = "Get customer profile")
    @GetMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerProfile(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomerById(id)));
    }

    @Operation(summary = "Update customer profile")
    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomerProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", customerService.updateCustomer(id, request)));
    }
}

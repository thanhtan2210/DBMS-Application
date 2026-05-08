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
import jakarta.validation.constraints.NotBlank;
import org.springframework.transaction.annotation.Transactional;

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

    @Data
    public static class AddressRequest {
        @NotBlank(message = "Receiver name is required")
        private String receiverName;

        @NotBlank(message = "Phone is required")
        private String phone;

        @NotBlank(message = "Street is required")
        private String street;

        private String ward;
        private String district;

        @NotBlank(message = "City is required")
        private String city;

        private String country;
        private String postalCode;
        private Boolean isDefault;
    }

    private AddressDto toAddressDto(Address address) {
        return AddressDto.builder()
                .addressId(address.getAddressId())
                .receiverName(address.getReceiverName())
                .phone(address.getPhone())
                .street(address.getStreet())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .isDefault(address.getIsDefault())
                .build();
    }

    private void reconcileDefaultAddress(Long userId, Long preferredDefaultAddressId, Long fallbackExcludedAddressId) {
        List<Address> addresses = addressRepository.findByUser_UserId(userId);
        if (addresses.isEmpty()) {
            return;
        }

        Address target = null;
        if (preferredDefaultAddressId != null) {
            target = addresses.stream()
                    .filter(address -> address.getAddressId().equals(preferredDefaultAddressId))
                    .findFirst()
                    .orElse(null);
        }

        if (target == null && fallbackExcludedAddressId != null) {
            target = addresses.stream()
                    .filter(address -> !address.getAddressId().equals(fallbackExcludedAddressId))
                    .filter(address -> Boolean.TRUE.equals(address.getIsDefault()))
                    .findFirst()
                    .orElse(null);
        }

        if (target == null) {
            target = addresses.stream()
                    .filter(address -> Boolean.TRUE.equals(address.getIsDefault()))
                    .findFirst()
                    .orElse(addresses.get(0));
        }

        Long targetId = target.getAddressId();
        boolean changed = false;
        for (Address address : addresses) {
            boolean shouldBeDefault = address.getAddressId().equals(targetId);
            if (!Boolean.valueOf(shouldBeDefault).equals(address.getIsDefault())) {
                address.setIsDefault(shouldBeDefault);
                changed = true;
            }
        }

        if (changed) {
            addressRepository.saveAll(addresses);
        }
    }

    @Operation(summary = "Get customer addresses")
    @GetMapping("/{id}/addresses")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getCustomerAddresses(@PathVariable Long id) {
        CustomerProfile customer = customerService.getCustomerProfile(id);

        List<AddressDto> addresses = addressRepository.findByUser_UserId(customer.getUser().getUserId())
                .stream()
                .map(this::toAddressDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved", addresses));
    }

    @Operation(summary = "Create customer address")
    @PostMapping("/{id}/addresses")
    @Transactional
    public ResponseEntity<ApiResponse<AddressDto>> createCustomerAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        CustomerProfile customer = customerService.getCustomerProfile(id);

        Address address = Address.builder()
                .user(customer.getUser())
                .receiverName(request.getReceiverName())
                .phone(request.getPhone())
                .street(request.getStreet())
                .ward(request.getWard())
                .district(request.getDistrict())
                .city(request.getCity())
                .country(request.getCountry() != null && !request.getCountry().isBlank() ? request.getCountry() : "Vietnam")
                .postalCode(request.getPostalCode())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .build();
        Address saved = addressRepository.save(address);

        if (Boolean.TRUE.equals(request.getIsDefault()) || addressRepository.findByUser_UserId(customer.getUser().getUserId()).stream().noneMatch(a -> !a.getAddressId().equals(saved.getAddressId()) && Boolean.TRUE.equals(a.getIsDefault()))) {
            reconcileDefaultAddress(customer.getUser().getUserId(), saved.getAddressId(), null);
        }

        return ResponseEntity.ok(ApiResponse.success("Address created", toAddressDto(saved)));
    }

    @Operation(summary = "Update customer address")
    @PutMapping("/{id}/addresses/{addressId}")
    @Transactional
    public ResponseEntity<ApiResponse<AddressDto>> updateCustomerAddress(
            @PathVariable Long id,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {
        CustomerProfile customer = customerService.getCustomerProfile(id);

        Address address = addressRepository.findById(addressId)
                .filter(item -> item.getUser().getUserId().equals(customer.getUser().getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Address", addressId));

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());

        address.setReceiverName(request.getReceiverName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setCity(request.getCity());
        address.setCountry(request.getCountry() != null && !request.getCountry().isBlank() ? request.getCountry() : "Vietnam");
        address.setPostalCode(request.getPostalCode());
        address.setIsDefault(Boolean.TRUE.equals(request.getIsDefault()));

        Address saved = addressRepository.save(address);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            reconcileDefaultAddress(customer.getUser().getUserId(), saved.getAddressId(), null);
        } else if (wasDefault) {
            reconcileDefaultAddress(customer.getUser().getUserId(), null, saved.getAddressId());
        }

        return ResponseEntity.ok(ApiResponse.success("Address updated", toAddressDto(saved)));
    }

    @Operation(summary = "Delete customer address")
    @DeleteMapping("/{id}/addresses/{addressId}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> deleteCustomerAddress(
            @PathVariable Long id,
            @PathVariable Long addressId) {
        CustomerProfile customer = customerService.getCustomerProfile(id);

        Address address = addressRepository.findById(addressId)
                .filter(item -> item.getUser().getUserId().equals(customer.getUser().getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Address", addressId));

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.delete(address);

        if (wasDefault) {
            reconcileDefaultAddress(customer.getUser().getUserId(), null, addressId);
        }

        return ResponseEntity.ok(ApiResponse.success("Address deleted"));
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

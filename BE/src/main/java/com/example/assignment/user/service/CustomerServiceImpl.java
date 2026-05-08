package com.example.assignment.user.service;

import com.example.assignment.shared.dto.PageResponse;
import com.example.assignment.shared.enums.UserRole;
import com.example.assignment.shared.enums.UserStatus;
import com.example.assignment.shared.exception.BusinessRuleViolationException;
import com.example.assignment.shared.exception.DuplicateResourceException;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import com.example.assignment.user.dto.CreateCustomerRequest;
import com.example.assignment.user.dto.CustomerResponse;
import com.example.assignment.user.dto.UpdateCustomerRequest;
import com.example.assignment.user.entity.Address;
import com.example.assignment.user.entity.CustomerProfile;
import com.example.assignment.user.entity.User;
import com.example.assignment.user.repository.AddressRepository;
import com.example.assignment.user.repository.CustomerProfileRepository;
import com.example.assignment.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final AddressRepository addressRepository;

    private String hashPassword(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Password hashing failed", e);
        }
    }

    @Override
    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(hashPassword(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(user);

        CustomerProfile profile = CustomerProfile.builder()
                .user(user)
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .loyaltyPoints(0)
                .build();
        customerProfileRepository.save(profile);

        if (request.getCity() != null) {
            String receiverName = request.getReceiverName() != null ? request.getReceiverName() : request.getFullName();
            String receiverPhone = request.getReceiverPhone() != null ? request.getReceiverPhone() : request.getPhone();
            Address address = Address.builder()
                    .user(user)
                    .receiverName(receiverName)
                    .phone(receiverPhone)
                    .street(request.getStreet())
                    .ward(request.getWard())
                    .district(request.getDistrict())
                    .city(request.getCity())
                    .country(request.getCountry() != null ? request.getCountry() : "Vietnam")
                    .postalCode(request.getPostalCode())
                    .isDefault(true)
                    .build();
            Address saved = addressRepository.save(address);
            profile.setDefaultShippingAddressId(saved.getAddressId());
            customerProfileRepository.save(profile);
        }

        log.info("Created customer: email={}", user.getEmail());
        return CustomerResponse.from(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long customerId) {
        CustomerProfile profile = customerProfileRepository.findByIdWithUser(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", customerId));
        return CustomerResponse.from(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerByEmail(String email) {
        User user = userRepository.findActiveByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        CustomerProfile profile = customerProfileRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("CustomerProfile", user.getUserId()));
        return CustomerResponse.from(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CustomerResponse> listCustomers(String city, String status, Pageable pageable) {
        return PageResponse.from(
                customerProfileRepository.findByFilters(city, status, pageable)
                        .map(CustomerResponse::from));
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long customerId, UpdateCustomerRequest request) {
        CustomerProfile profile = customerProfileRepository.findByIdWithUser(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", customerId));
        User user = profile.getUser();

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("User", "email", request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getStatus() != null) user.setStatus(UserStatus.valueOf(request.getStatus()));

        userRepository.save(user);
        customerProfileRepository.save(profile);
        return CustomerResponse.from(profile);
    }

    @Override
    @Transactional
    public void deactivateCustomer(Long customerId) {
        CustomerProfile profile = customerProfileRepository.findByIdWithUser(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", customerId));
        profile.getUser().setStatus(UserStatus.INACTIVE);
        userRepository.save(profile.getUser());
    }

    @Override
    @Transactional
    public void deleteCustomer(Long customerId) {
        CustomerProfile profile = customerProfileRepository.findByIdWithUser(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", customerId));
        // Soft delete — block hard delete if orders exist (simplified; real check queries order table)
        profile.getUser().softDelete();
        userRepository.save(profile.getUser());
    }

    @Override
    public CustomerProfile getCustomerProfile(Long id) {
        return customerProfileRepository.findByIdWithUser(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }
}

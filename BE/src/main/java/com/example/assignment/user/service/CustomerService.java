package com.example.assignment.user.service;

import com.example.assignment.shared.dto.PageResponse;
import com.example.assignment.user.dto.CreateCustomerRequest;
import com.example.assignment.user.dto.CustomerResponse;
import com.example.assignment.user.dto.UpdateCustomerRequest;
import com.example.assignment.user.entity.CustomerProfile;
import org.springframework.data.domain.Pageable;

/**
 * Service contract for FR-01: Customer Management.
 * All business logic lives in CustomerServiceImpl; controllers depend on this interface (DIP).
 */
public interface CustomerService {

    CustomerResponse createCustomer(CreateCustomerRequest request);

    CustomerResponse getCustomerById(Long customerId);

    CustomerResponse getCustomerByEmail(String email);

    PageResponse<CustomerResponse> listCustomers(String city, String status, Pageable pageable);

    CustomerResponse updateCustomer(Long customerId, UpdateCustomerRequest request);

    void deactivateCustomer(Long customerId);

    void deleteCustomer(Long customerId);

    CustomerProfile getCustomerProfile(Long id);
}

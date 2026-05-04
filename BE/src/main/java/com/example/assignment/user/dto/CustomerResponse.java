package com.example.assignment.user.dto;

import com.example.assignment.user.entity.CustomerProfile;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CustomerResponse {

    private Long customerId;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
    private LocalDate dateOfBirth;
    private String gender;
    private Integer loyaltyPoints;
    private LocalDateTime createdAt;

    public static CustomerResponse from(CustomerProfile profile) {
        return CustomerResponse.builder()
                .customerId(profile.getCustomerId())
                .userId(profile.getUser().getUserId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .phone(profile.getUser().getPhone())
                .role(profile.getUser().getRole().name())
                .status(profile.getUser().getStatus().name())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .loyaltyPoints(profile.getLoyaltyPoints())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}

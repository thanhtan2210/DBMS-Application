package com.example.assignment.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateCustomerRequest {

    @Size(max = 255)
    private String fullName;

    @Email
    private String email;

    @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$")
    private String phone;

    private LocalDate dateOfBirth;
    private String gender;
    private String status;
}

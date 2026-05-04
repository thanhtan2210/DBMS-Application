package com.example.assignment.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_\\W]).{8,}$", message = "Password must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character")
    private String password;

    @NotBlank(message = "Retype password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_\\W]).{8,}$", message = "Retype password must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character")
    private String retypePassword;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
}

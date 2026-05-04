package com.example.assignment.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Schema(description = "Request body for registering a new customer account")
@Data
public class CreateCustomerRequest {

    @Schema(description = "Full display name of the customer", example = "Nguyen Van An", maxLength = 255)
    @NotBlank(message = "Full name is required")
    @Size(max = 255)
    private String fullName;

    @Schema(description = "Unique email address used as login credential", example = "an.nguyen@example.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @Schema(description = "Account password (min 6 characters — stored hashed)", example = "s3cur3P@ss")
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Schema(description = "Phone number (7–20 digits, may include +, -, spaces)", example = "+84 912 345 678")
    @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$", message = "Invalid phone format")
    private String phone;

    @Schema(description = "Date of birth", example = "1995-08-20", type = "string", format = "date")
    private LocalDate dateOfBirth;

    @Schema(description = "Gender: MALE | FEMALE | OTHER", example = "MALE")
    private String gender;

    // Optional default address
    @Schema(description = "Street address of default shipping address", example = "123 Nguyen Hue")
    private String street;

    @Schema(description = "Ward / Phường", example = "Ben Nghe")
    private String ward;

    @Schema(description = "District / Quận", example = "District 1")
    private String district;

    @Schema(description = "City (required)", example = "Ho Chi Minh City")
    @NotBlank(message = "City is required")
    private String city;

    @Schema(description = "Country code or name", example = "Vietnam")
    private String country;

    @Schema(description = "Postal / ZIP code", example = "700000")
    private String postalCode;

    @Schema(description = "Name of address receiver (defaults to fullName if blank)", example = "Nguyen Van An")
    private String receiverName;

    @Schema(description = "Phone number of address receiver", example = "+84 912 345 678")
    private String receiverPhone;
}


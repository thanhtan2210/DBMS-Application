package com.example.assignment.user.controller;

import com.example.assignment.user.dto.AuthResponse;
import com.example.assignment.user.dto.LoginRequest;
import com.example.assignment.user.dto.MessageResponse;
import com.example.assignment.user.dto.RegisterRequest;
import com.example.assignment.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerCustomer(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

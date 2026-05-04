package com.example.assignment.user.service;

import com.example.assignment.shared.enums.UserRole;
import com.example.assignment.shared.enums.UserStatus;
import com.example.assignment.shared.exception.DuplicateResourceException;
import com.example.assignment.shared.security.JwtService;
import com.example.assignment.user.dto.AuthResponse;
import com.example.assignment.user.dto.LoginRequest;
import com.example.assignment.user.dto.MessageResponse;
import com.example.assignment.user.dto.RegisterRequest;
import com.example.assignment.user.entity.CustomerProfile;
import com.example.assignment.user.entity.User;
import com.example.assignment.user.repository.CustomerProfileRepository;
import com.example.assignment.user.repository.UserRepository;
import com.example.assignment.user.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final CustomerProfileRepository customerProfileRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @Transactional
        public MessageResponse registerCustomer(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new DuplicateResourceException("User", "email", request.getEmail());
                }

                if (!request.getPassword().equals(request.getRetypePassword())) {
                        throw new IllegalArgumentException("Passwords do not match");
                }

                User user = User.builder()
                                .email(request.getEmail())
                                .passwordHash(passwordEncoder.encode(request.getPassword()))
                                .fullName(request.getFullName())
                                .phone(request.getPhone())
                                .role(UserRole.CUSTOMER)
                                .status(UserStatus.ACTIVE)
                                .build();

                user = userRepository.save(user);

                CustomerProfile profile = CustomerProfile.builder()
                                .user(user)
                                .dateOfBirth(request.getDateOfBirth())
                                .gender(request.getGender())
                                .build();

                customerProfileRepository.save(profile);

                return new MessageResponse("Register successfully");
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

                String token = jwtService.generateToken(new CustomUserDetails(user));

                return new AuthResponse(token);
        }
}

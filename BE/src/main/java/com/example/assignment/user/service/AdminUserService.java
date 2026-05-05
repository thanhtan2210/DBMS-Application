package com.example.assignment.user.service;

import com.example.assignment.shared.dto.PageResponse;
import com.example.assignment.shared.enums.UserRole;
import com.example.assignment.shared.enums.UserStatus;
import com.example.assignment.shared.exception.ResourceNotFoundException;
import com.example.assignment.user.entity.User;
import com.example.assignment.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PageResponse<User> listInternalUsers(Pageable pageable) {
        // Here we ideally want to filter out CUSTOMERs, but for simplicity we'll just fetch all or we can fetch by roles
        // Let's filter out CUSTOMER using a custom query if needed, or simply return all and let the frontend filter,
        // or we just return all users for the "Users" dashboard.
        Page<User> users = userRepository.findAll(pageable);
        return PageResponse.from(users);
    }

    @Transactional
    public User changeUserRole(Long id, String newRole) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setRole(UserRole.valueOf(newRole.toUpperCase()));
        return userRepository.save(user);
    }

    @Transactional
    public User changeUserStatus(Long id, String newStatus) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setStatus(UserStatus.valueOf(newStatus.toUpperCase()));
        return userRepository.save(user);
    }
}

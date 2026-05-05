package com.example.assignment.user.controller;

import com.example.assignment.shared.dto.ApiResponse;
import com.example.assignment.shared.dto.PageResponse;
import com.example.assignment.user.entity.User;
import com.example.assignment.user.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Admin Users", description = "Admin CRUD APIs for Internal Users")
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @Operation(summary = "List all users")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<User>>> listUsers(@PageableDefault(size = 50) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminUserService.listInternalUsers(pageable)));
    }

    @Operation(summary = "Change user role")
    @PatchMapping("/{id}/role")
    public ResponseEntity<ApiResponse<User>> changeUserRole(
            @PathVariable Long id, @RequestParam String role) {
        return ResponseEntity.ok(ApiResponse.success("Role updated", adminUserService.changeUserRole(id, role)));
    }

    @Operation(summary = "Change user status")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<User>> changeUserStatus(
            @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", adminUserService.changeUserStatus(id, status)));
    }
}

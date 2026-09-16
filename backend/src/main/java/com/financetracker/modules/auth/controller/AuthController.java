package com.financetracker.modules.auth.controller;

import com.financetracker.modules.auth.dto.AuthResponse;
import com.financetracker.modules.auth.dto.LoginRequest;
import com.financetracker.modules.auth.dto.RegisterRequest;
import com.financetracker.modules.auth.dto.UserDto;
import com.financetracker.modules.auth.service.AuthService;
import com.financetracker.shared.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        UserDto user = authService.getCurrentUser(currentUserId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Успешный выход из системы"));
    }
}

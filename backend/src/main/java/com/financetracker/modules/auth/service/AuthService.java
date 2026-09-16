package com.financetracker.modules.auth.service;

import com.financetracker.modules.auth.dto.AuthResponse;
import com.financetracker.modules.auth.dto.ChangePasswordRequest;
import com.financetracker.modules.auth.dto.LoginRequest;
import com.financetracker.modules.auth.dto.RegisterRequest;
import com.financetracker.modules.auth.dto.UpdateProfileRequest;
import com.financetracker.modules.auth.dto.UserDto;
import com.financetracker.modules.auth.entity.User;
import com.financetracker.modules.auth.repository.UserRepository;
import com.financetracker.shared.exception.BadRequestException;
import com.financetracker.shared.exception.NotFoundException;
import com.financetracker.shared.exception.UnauthorizedException;
import com.financetracker.shared.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Пользователь с таким email уже зарегистрирован");
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .name(request.getName().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .currency(request.getCurrency() != null && !request.getCurrency().isBlank() ? request.getCurrency() : "KZT")
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.fromEntity(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Неверный email или пароль"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Неверный email или пароль");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional
    public AuthResponse loginWithGoogle(com.financetracker.modules.auth.dto.GoogleAuthRequest request) {
        String idToken = request.getIdToken();
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            @SuppressWarnings("unchecked")
            Map<String, Object> googleInfo = restTemplate.getForObject(url, Map.class);

            if (googleInfo == null || !googleInfo.containsKey("email")) {
                throw new UnauthorizedException("Недействительный Google токен");
            }

            String email = ((String) googleInfo.get("email")).toLowerCase().trim();
            String name = (String) googleInfo.getOrDefault("name", "Google User");
            String picture = (String) googleInfo.get("picture");

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = User.builder()
                        .email(email)
                        .name(name != null && !name.isBlank() ? name : email)
                        .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .avatarUrl(picture)
                        .currency("KZT")
                        .build();
                return userRepository.save(newUser);
            });

            String token = jwtService.generateToken(user.getId(), user.getEmail());

            return AuthResponse.builder()
                    .token(token)
                    .user(UserDto.fromEntity(user))
                    .build();
        } catch (Exception e) {
            log.error("Google authentication failed", e);
            throw new UnauthorizedException("Ошибка авторизации Google: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        user.setName(request.getName().trim());
        if (request.getCurrency() != null && !request.getCurrency().isBlank()) {
            user.setCurrency(request.getCurrency());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Старый пароль указан неверно");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

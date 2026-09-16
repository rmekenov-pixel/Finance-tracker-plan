package com.financetracker.modules.auth.service;

import com.financetracker.modules.auth.dto.AuthResponse;
import com.financetracker.modules.auth.dto.LoginRequest;
import com.financetracker.modules.auth.dto.RegisterRequest;
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

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        return UserDto.fromEntity(user);
    }
}

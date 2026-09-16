package com.financetracker.modules.auth;

import com.financetracker.modules.auth.dto.AuthResponse;
import com.financetracker.modules.auth.dto.LoginRequest;
import com.financetracker.modules.auth.dto.RegisterRequest;
import com.financetracker.modules.auth.service.AuthService;
import com.financetracker.shared.exception.BadRequestException;
import com.financetracker.shared.exception.UnauthorizedException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    void registerAndLogin_Success() {
        RegisterRequest registerReq = RegisterRequest.builder()
                .email("test@financetracker.com")
                .password("password123")
                .name("Тестовый Пользователь")
                .currency("KZT")
                .build();

        AuthResponse registerResp = authService.register(registerReq);
        assertNotNull(registerResp.getToken());
        assertNotNull(registerResp.getUser().getId());
        assertEquals("test@financetracker.com", registerResp.getUser().getEmail());

        LoginRequest loginReq = LoginRequest.builder()
                .email("test@financetracker.com")
                .password("password123")
                .build();

        AuthResponse loginResp = authService.login(loginReq);
        assertNotNull(loginResp.getToken());
        assertEquals(registerResp.getUser().getId(), loginResp.getUser().getId());
    }

    @Test
    void registerDuplicateEmail_ThrowsBadRequest() {
        RegisterRequest registerReq = RegisterRequest.builder()
                .email("duplicate@financetracker.com")
                .password("password123")
                .name("Пользователь 1")
                .build();

        authService.register(registerReq);

        assertThrows(BadRequestException.class, () -> authService.register(registerReq));
    }

    @Test
    void loginWithWrongPassword_ThrowsUnauthorized() {
        RegisterRequest registerReq = RegisterRequest.builder()
                .email("wrongpwd@financetracker.com")
                .password("correctPassword")
                .name("Пользователь")
                .build();

        authService.register(registerReq);

        LoginRequest wrongLogin = LoginRequest.builder()
                .email("wrongpwd@financetracker.com")
                .password("wrongPassword")
                .build();

        assertThrows(UnauthorizedException.class, () -> authService.login(wrongLogin));
    }
}

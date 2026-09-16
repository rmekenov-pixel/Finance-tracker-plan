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

import java.util.UUID;

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

    @Test
    void updateProfileAndChangePassword_Success() {
        RegisterRequest registerReq = RegisterRequest.builder()
                .email("profile_change@test.com")
                .password("oldPassword123")
                .name("Old Name")
                .currency("KZT")
                .build();

        AuthResponse resp = authService.register(registerReq);
        UUID userId = resp.getUser().getId();

        // Update Profile
        com.financetracker.modules.auth.dto.UpdateProfileRequest updateReq = com.financetracker.modules.auth.dto.UpdateProfileRequest.builder()
                .name("New Name")
                .currency("USD")
                .build();

        com.financetracker.modules.auth.dto.UserDto updated = authService.updateProfile(userId, updateReq);
        assertEquals("New Name", updated.getName());
        assertEquals("USD", updated.getCurrency());

        // Change Password
        com.financetracker.modules.auth.dto.ChangePasswordRequest changePwdReq = com.financetracker.modules.auth.dto.ChangePasswordRequest.builder()
                .oldPassword("oldPassword123")
                .newPassword("newPassword456")
                .build();

        authService.changePassword(userId, changePwdReq);

        // Login with new password
        LoginRequest newLogin = LoginRequest.builder()
                .email("profile_change@test.com")
                .password("newPassword456")
                .build();

        AuthResponse newAuth = authService.login(newLogin);
        assertNotNull(newAuth.getToken());
    }
}

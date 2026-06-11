package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.dto.LoginRequest;
import com.staffbase.dto.RefreshRequest;
import com.staffbase.models.*;
import com.staffbase.repositories.jpa.*;
import com.staffbase.repositories.mongo.*;
import com.staffbase.security.JwtTokenProvider;
import com.staffbase.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private UserRepository userRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private LoginAuditRepository loginAuditRepository;
    @Mock private RegistrationRequestRepository registrationRequestRepository;
    @Mock private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock private NotificationRepository notificationRepository;
    @Mock private EmailService emailService;
    @Mock private RoleRepository roleRepository;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private HttpServletRequest httpRequest;

    private AuthController authController;

    @BeforeEach
    void setUp() {
        authController = new AuthController(
                userRepository, employeeRepository, refreshTokenRepository,
                loginAuditRepository, registrationRequestRepository,
                passwordResetTokenRepository, notificationRepository,
                emailService, roleRepository, tokenProvider, passwordEncoder);
    }

    // --- Login Tests ---

    @Test
    void login_validCredentials_returnsOkWithTokens() {
        LoginRequest req = new LoginRequest("user@test.com", "password123");
        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");

        User user = createTestUser("user@test.com", "encodedPw", true);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPw")).thenReturn(true);
        when(tokenProvider.generateAccessToken("user@test.com", "Employee")).thenReturn("access-token");
        when(refreshTokenRepository.findByUser(user)).thenReturn(Optional.empty());
        when(loginAuditRepository.save(any())).thenReturn(null);
        when(refreshTokenRepository.save(any())).thenReturn(null);

        ResponseEntity<?> resp = authController.login(req, httpRequest);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        ApiResponse<?> body = (ApiResponse<?>) resp.getBody();
        assertNotNull(body);
        assertTrue(body.isSuccess());
        assertEquals("Login successful", body.getMessage());
    }

    @Test
    void login_nonExistentUser_returns401() {
        LoginRequest req = new LoginRequest("nobody@test.com", "password");
        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");
        when(userRepository.findByEmail("nobody@test.com")).thenReturn(Optional.empty());
        when(loginAuditRepository.save(any())).thenReturn(null);

        ResponseEntity<?> resp = authController.login(req, httpRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, resp.getStatusCode());
        ApiResponse<?> body = (ApiResponse<?>) resp.getBody();
        assertNotNull(body);
        assertFalse(body.isSuccess());
    }

    @Test
    void login_wrongPassword_returns401() {
        LoginRequest req = new LoginRequest("user@test.com", "wrong");
        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");

        User user = createTestUser("user@test.com", "encodedPw", true);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encodedPw")).thenReturn(false);
        when(loginAuditRepository.save(any())).thenReturn(null);

        ResponseEntity<?> resp = authController.login(req, httpRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, resp.getStatusCode());
    }

    @Test
    void login_inactiveUser_returns403() {
        LoginRequest req = new LoginRequest("user@test.com", "password123");
        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");

        User user = createTestUser("user@test.com", "encodedPw", false);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPw")).thenReturn(true);
        when(loginAuditRepository.save(any())).thenReturn(null);

        ResponseEntity<?> resp = authController.login(req, httpRequest);

        assertEquals(HttpStatus.FORBIDDEN, resp.getStatusCode());
    }

    // --- Refresh Tests ---

    @Test
    void refresh_validToken_returnsNewAccessToken() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("valid-refresh-token");

        User user = createTestUser("user@test.com", "pw", true);
        RefreshToken refreshToken = new RefreshToken("valid-refresh-token", user, Instant.now().plusSeconds(3600));
        when(refreshTokenRepository.findByToken("valid-refresh-token")).thenReturn(Optional.of(refreshToken));
        when(tokenProvider.generateAccessToken("user@test.com", "Employee")).thenReturn("new-access-token");

        ResponseEntity<?> resp = authController.refresh(req);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        ApiResponse<?> body = (ApiResponse<?>) resp.getBody();
        assertNotNull(body);
        assertTrue(body.isSuccess());
    }

    @Test
    void refresh_tokenNotFound_returns401() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("unknown-token");
        when(refreshTokenRepository.findByToken("unknown-token")).thenReturn(Optional.empty());

        ResponseEntity<?> resp = authController.refresh(req);

        assertEquals(HttpStatus.UNAUTHORIZED, resp.getStatusCode());
    }

    @Test
    void refresh_expiredToken_returns401() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("expired-token");

        User user = createTestUser("user@test.com", "pw", true);
        RefreshToken expiredToken = new RefreshToken("expired-token", user, Instant.now().minusSeconds(3600));
        when(refreshTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(expiredToken));

        ResponseEntity<?> resp = authController.refresh(req);

        assertEquals(HttpStatus.UNAUTHORIZED, resp.getStatusCode());
        verify(refreshTokenRepository).delete(expiredToken);
    }

    // --- Logout Tests ---

    @Test
    void logout_withRefreshToken_deletesTokenAndReturnsOk() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("some-token");

        RefreshToken token = new RefreshToken();
        when(refreshTokenRepository.findByToken("some-token")).thenReturn(Optional.of(token));

        ResponseEntity<?> resp = authController.logout(req);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        verify(refreshTokenRepository).delete(token);
    }

    @Test
    void logout_withoutBody_returnsOk() {
        ResponseEntity<?> resp = authController.logout(null);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
    }

    // --- Register Tests ---

    @Test
    void register_validRequest_returnsOk() {
        RegistrationRequest req = new RegistrationRequest();
        req.setEmail("new@employee.com");
        req.setName("New Employee");
        req.setPassword("password123");

        when(userRepository.findByEmail("new@employee.com")).thenReturn(Optional.empty());
        when(registrationRequestRepository.findByEmailAndStatus("new@employee.com", "PENDING")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(registrationRequestRepository.save(any())).thenReturn(req);
        when(notificationRepository.save(any())).thenReturn(null);

        ResponseEntity<?> resp = authController.register(req);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        ApiResponse<?> body = (ApiResponse<?>) resp.getBody();
        assertNotNull(body);
        assertTrue(body.isSuccess());
    }

    @Test
    void register_existingEmail_returnsBadRequest() {
        RegistrationRequest req = new RegistrationRequest();
        req.setEmail("existing@test.com");
        req.setName("Test");

        when(userRepository.findByEmail("existing@test.com")).thenReturn(Optional.of(new User()));

        ResponseEntity<?> resp = authController.register(req);

        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
    }

    @Test
    void register_missingEmail_returnsBadRequest() {
        RegistrationRequest req = new RegistrationRequest();
        req.setName("Test");

        ResponseEntity<?> resp = authController.register(req);

        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
    }

    @Test
    void register_missingName_returnsBadRequest() {
        RegistrationRequest req = new RegistrationRequest();
        req.setEmail("test@test.com");

        ResponseEntity<?> resp = authController.register(req);

        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
    }

    @Test
    void register_adminDomain_setsAdminRole() {
        RegistrationRequest req = new RegistrationRequest();
        req.setEmail("admin@admin.com");
        req.setName("Admin User");
        req.setPassword("password");

        when(userRepository.findByEmail("admin@admin.com")).thenReturn(Optional.empty());
        when(registrationRequestRepository.findByEmailAndStatus("admin@admin.com", "PENDING")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(registrationRequestRepository.save(any(RegistrationRequest.class))).thenAnswer(inv -> {
            RegistrationRequest saved = inv.getArgument(0);
            assertEquals("Admin", saved.getRole());
            return saved;
        });
        when(notificationRepository.save(any())).thenReturn(null);

        ResponseEntity<?> resp = authController.register(req);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
    }

    @Test
    void register_hrDomain_setsHRRole() {
        RegistrationRequest req = new RegistrationRequest();
        req.setEmail("hr@hr.com");
        req.setName("HR User");
        req.setPassword("password");

        when(userRepository.findByEmail("hr@hr.com")).thenReturn(Optional.empty());
        when(registrationRequestRepository.findByEmailAndStatus("hr@hr.com", "PENDING")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(registrationRequestRepository.save(any(RegistrationRequest.class))).thenAnswer(inv -> {
            RegistrationRequest saved = inv.getArgument(0);
            assertEquals("HR", saved.getRole());
            return saved;
        });
        when(notificationRepository.save(any())).thenReturn(null);

        ResponseEntity<?> resp = authController.register(req);
        assertEquals(HttpStatus.OK, resp.getStatusCode());
    }

    @Test
    void register_pendingRequest_returnsBadRequest() {
        RegistrationRequest req = new RegistrationRequest();
        req.setEmail("pending@test.com");
        req.setName("Pending");

        when(userRepository.findByEmail("pending@test.com")).thenReturn(Optional.empty());
        when(registrationRequestRepository.findByEmailAndStatus("pending@test.com", "PENDING"))
                .thenReturn(Optional.of(new RegistrationRequest()));

        ResponseEntity<?> resp = authController.register(req);

        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
    }

    private User createTestUser(String email, String password, boolean active) {
        User user = new User(email, password, "EMP-101");
        user.setActive(active);
        Role role = new Role();
        role.setName("Employee");
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        return user;
    }
}

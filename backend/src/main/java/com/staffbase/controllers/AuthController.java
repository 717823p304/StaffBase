package com.staffbase.controllers;

import com.staffbase.dto.*;
import com.staffbase.models.*;
import com.staffbase.repositories.jpa.*;
import com.staffbase.repositories.mongo.*;
import com.staffbase.security.JwtTokenProvider;
import com.staffbase.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LoginAuditRepository loginAuditRepository;
    private final RegistrationRequestRepository registrationRequestRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final RoleRepository roleRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            RefreshTokenRepository refreshTokenRepository,
            LoginAuditRepository loginAuditRepository,
            RegistrationRequestRepository registrationRequestRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            NotificationRepository notificationRepository,
            EmailService emailService,
            RoleRepository roleRepository,
            JwtTokenProvider tokenProvider,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.loginAuditRepository = loginAuditRepository;
        this.registrationRequestRepository = registrationRequestRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.roleRepository = roleRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            // Audit Log in MySQL
            loginAuditRepository.save(new LoginAudit(loginRequest.getEmail(), "FAILURE", ipAddress, "User does not exist"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid email or password credentials"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Audit Log in MySQL
            loginAuditRepository.save(new LoginAudit(loginRequest.getEmail(), "FAILURE", ipAddress, "Incorrect password"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid email or password credentials"));
        }

        if (!user.isActive()) {
            loginAuditRepository.save(new LoginAudit(loginRequest.getEmail(), "FAILURE", ipAddress, "Account is disabled"));
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, "Your account has been deactivated"));
        }

        // Generate Access and Refresh Tokens
        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole());
        String refreshStringToken = UUID.randomUUID().toString();

        // Expire in 7 days
        Instant expiryDate = Instant.now().plusMillis(7 * 24 * 60 * 60 * 1000L);
        
        // Remove old token if exists
        Optional<RefreshToken> existingTokenOpt = refreshTokenRepository.findByUser(user);
        existingTokenOpt.ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = new RefreshToken(refreshStringToken, user, expiryDate);
        refreshTokenRepository.save(refreshToken);

        // Audit Log in MySQL
        loginAuditRepository.save(new LoginAudit(user.getEmail(), "SUCCESS", ipAddress, "User logged in successfully"));

        // Load Employee Profile
        Employee employee = null;
        if (user.getEmployeeId() != null) {
            employee = employeeRepository.findById(user.getEmployeeId()).orElse(null);
        }

        LoginResponse.UserDetailsDto userDetails = new LoginResponse.UserDetailsDto(
                user.getEmail(),
                user.getRole(),
                employee
        );

        LoginResponse loginResponse = new LoginResponse(accessToken, refreshStringToken, userDetails);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", loginResponse));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequest refreshRequest) {
        String tokenStr = refreshRequest.getRefreshToken();
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(tokenStr);

        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Refresh token not found"));
        }

        RefreshToken refreshToken = tokenOpt.get();
        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Refresh token expired. Please login again."));
        }

        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole());

        // Wrap response data to match api.js expectations
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed", new LoginResponse(newAccessToken, tokenStr, null)));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody(required = false) RefreshRequest refreshRequest) {
        if (refreshRequest != null && refreshRequest.getRefreshToken() != null) {
            Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(refreshRequest.getRefreshToken());
            tokenOpt.ifPresent(refreshTokenRepository::delete);
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getName() == null || request.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Name and Email are required"));
        }

        // Check if user or pending request already exists
        if (userRepository.findByEmail(request.getEmail().trim().toLowerCase()).isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Email is already registered"));
        }
        
        Optional<RegistrationRequest> pendingRequest = registrationRequestRepository.findByEmailAndStatus(
                request.getEmail().trim().toLowerCase(), "PENDING");
        if (pendingRequest.isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "A registration request is already pending for this email"));
        }

        // Determine role automatically by email domain suffix
        String email = request.getEmail().trim().toLowerCase();
        String targetRole = "Employee";
        if (email.endsWith("@admin.com")) {
            targetRole = "Admin";
        } else if (email.endsWith("@hr.com")) {
            targetRole = "HR";
        } else if (email.endsWith("@employee.com")) {
            targetRole = "Employee";
        }

        // Hashing password temporarily
        request.setEmail(email);
        request.setRole(targetRole);
        request.setStatus("PENDING");
        String plainPassword = request.getPassword();
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            plainPassword = "password123";
        }
        request.setPassword(passwordEncoder.encode(plainPassword));
        registrationRequestRepository.save(request);

        // Notify HR/Admin users
        Notification notification = new Notification(
                "New Profile Request",
                "A new profile request from " + request.getName() + " (" + request.getEmail() + ") is pending HR approval.",
                "info",
                null
        );
        notificationRepository.save(notification);

        return ResponseEntity.ok(new ApiResponse<>(true, "Profile request sent to HR successfully"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String idToken = body.get("idToken");
        if (idToken == null || idToken.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Google ID Token is required"));
        }

        String email = "";
        String name = "";
        
        // 1. Verify Google Token (Supports both Mock Token and Google tokeninfo endpoint)
        if (idToken.startsWith("mock_google_token_")) {
            // Mock token format: mock_google_token_<email>_<name>
            String[] parts = idToken.split("_");
            if (parts.length >= 5) {
                email = parts[3].trim().toLowerCase();
                name = parts[4].trim();
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Invalid mock Google token format"));
            }
        } else {
            // Real verification: call https://oauth2.googleapis.com/tokeninfo?id_token=...
            try {
                HttpClient client = HttpClient.newHttpClient();
                HttpRequest httpRequest = HttpRequest.newBuilder()
                        .uri(URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken))
                        .GET()
                        .build();
                HttpResponse<String> httpResponse = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
                if (httpResponse.statusCode() != 200) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new ApiResponse<>(false, "Google OAuth verification failed"));
                }
                
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> payload = mapper.readValue(httpResponse.body(), Map.class);
                if (!payload.containsKey("email")) {
                    return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Email not found in Google token payload"));
                }
                email = ((String) payload.get("email")).trim().toLowerCase();
                name = payload.containsKey("name") ? (String) payload.get("name") : email.split("@")[0];
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse<>(false, "Error verifying Google token: " + e.getMessage()));
            }
        }

        String ipAddress = request.getRemoteAddr();
        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;

        if (userOpt.isPresent()) {
            user = userOpt.get();
            if (!user.isActive()) {
                loginAuditRepository.save(new LoginAudit(email, "FAILURE", ipAddress, "Google User account is disabled"));
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "Your account has been deactivated"));
            }
            if (!user.isGoogleUser()) {
                user.setGoogleUser(true);
                userRepository.save(user);
            }
            loginAuditRepository.save(new LoginAudit(email, "SUCCESS", ipAddress, "Google user logged in successfully"));
        } else {
            // Auto-register new user
            // 1. Generate Employee ID
            long count = employeeRepository.count();
            String empId = "EMP-" + (100 + count + 1);

            // 2. Create Employee profile in MongoDB
            Employee emp = new Employee(
                    empId,
                    name,
                    email,
                    "Account auto-created via Google OAuth Sign-In.",
                    "Engineering", // Default department
                    "Software Engineer", // Default designation
                    new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()),
                    "Active",
                    "#3B82F6"
            );
            employeeRepository.save(emp);

            // 3. Create User account in MySQL (Link with Employee ID)
            String randomPassword = UUID.randomUUID().toString(); // Random string since they login via Google
            user = new User(email, passwordEncoder.encode(randomPassword), empId);
            user.setGoogleUser(true);
            user.setActive(true);

            // Determine role automatically by email domain suffix
            String roleName = "Employee";
            if (email.endsWith("@admin.com")) {
                roleName = "Admin";
            } else if (email.endsWith("@hr.com")) {
                roleName = "HR";
            } else if (email.endsWith("@employee.com")) {
                roleName = "Employee";
            }
            Role dbRole = roleRepository.findByName(roleName).orElse(null);
            if (dbRole == null) {
                dbRole = roleRepository.findByName("Employee").orElse(null);
            }
            if (dbRole != null) {
                user.getRoles().add(dbRole);
            }
            userRepository.save(user);
            loginAuditRepository.save(new LoginAudit(email, "SUCCESS", ipAddress, "New user auto-registered via Google Sign-In"));
        }

        // Generate Access and Refresh Tokens
        String accessToken = tokenProvider.generateAccessToken(user.getEmail(), user.getRole());
        String refreshStringToken = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusMillis(7 * 24 * 60 * 60 * 1000L);

        Optional<RefreshToken> existingTokenOpt = refreshTokenRepository.findByUser(user);
        existingTokenOpt.ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = new RefreshToken(refreshStringToken, user, expiryDate);
        refreshTokenRepository.save(refreshToken);

        // Load Employee Profile
        Employee employee = null;
        if (user.getEmployeeId() != null) {
            employee = employeeRepository.findById(user.getEmployeeId()).orElse(null);
        }

        LoginResponse.UserDetailsDto userDetails = new LoginResponse.UserDetailsDto(
                user.getEmail(),
                user.getRole(),
                employee
        );

        LoginResponse loginResponse = new LoginResponse(accessToken, refreshStringToken, userDetails);
        return ResponseEntity.ok(new ApiResponse<>(true, "Google authentication successful", loginResponse));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Email is required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>(true, "If the email is registered in our directory, a secure credentials reset token has been dispatched."));
        }

        User user = userOpt.get();
        String tokenStr = UUID.randomUUID().toString();
        Instant expiry = Instant.now().plusSeconds(15 * 60); // 15 minutes expiration

        passwordResetTokenRepository.deleteByUser(user);

        PasswordResetToken resetToken = new PasswordResetToken(tokenStr, user, expiry);
        passwordResetTokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/#/reset-password?token=" + tokenStr;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return ResponseEntity.ok(new ApiResponse<>(true, "If the email is registered in our directory, a secure credentials reset token has been dispatched."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || token.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Token and newPassword are required"));
        }

        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token.trim());
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid or unrecognized reset token"));
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(Instant.now())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Reset link has expired or has already been used"));
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(new ApiResponse<>(true, "Password overhauled successfully. Please proceed to login."));
    }
}

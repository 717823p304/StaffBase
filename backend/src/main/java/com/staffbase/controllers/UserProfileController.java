package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.Employee;
import com.staffbase.models.User;
import com.staffbase.repositories.jpa.UserRepository;
import com.staffbase.repositories.mongo.EmployeeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserProfileController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final String uploadDir;

    public UserProfileController(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder,
            @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.uploadDir = uploadDir;
        
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String email = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "User session not found"));
        }

        User user = userOpt.get();
        Employee employee = null;
        if (user.getEmployeeId() != null) {
            employee = employeeRepository.findById(user.getEmployeeId()).orElse(null);
        }

        if (employee == null) {
            // Seed a mock employee profile dynamically if none is found to avoid nulls
            employee = new Employee("EMP-SYS", "System Administrator", user.getEmail(), "Admin account.", "Management", "Director", "2024-01-10", "Active", "#EF4444");
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Profile loaded successfully", employee));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates) {
        String email = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "User profile not found"));
        }

        User user = userOpt.get();
        if (user.getEmployeeId() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "No employee profile linked to this user"));
        }

        Optional<Employee> empOpt = employeeRepository.findById(user.getEmployeeId());
        if (empOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Employee profile not found"));
        }

        Employee emp = empOpt.get();
        if (updates.containsKey("name")) emp.setName((String) updates.get("name"));
        if (updates.containsKey("bio")) emp.setBio((String) updates.get("bio"));
        
        if (updates.containsKey("skills")) {
            List<String> skillsList = (List<String>) updates.get("skills");
            emp.setSkills(skillsList);
        }

        if (updates.containsKey("emergencyContacts")) {
            List<Map<String, String>> contactsRaw = (List<Map<String, String>>) updates.get("emergencyContacts");
            List<Employee.EmergencyContact> contacts = new ArrayList<>();
            for (Map<String, String> c : contactsRaw) {
                contacts.add(new Employee.EmergencyContact(
                    c.get("name"), c.get("relationship"), c.get("phone"), c.get("email")
                ));
            }
            emp.setEmergencyContacts(contacts);
        }

        if (updates.containsKey("bankingInfo")) {
            Map<String, Object> bankingRaw = (Map<String, Object>) updates.get("bankingInfo");
            Employee.BankingInfo banking = emp.getBankingInfo();
            if (banking == null) banking = new Employee.BankingInfo();

            if (bankingRaw.containsKey("bankName")) banking.setBankName((String) bankingRaw.get("bankName"));
            if (bankingRaw.containsKey("accountName")) banking.setAccountName((String) bankingRaw.get("accountName"));
            if (bankingRaw.containsKey("accountNumber")) banking.setAccountNumber((String) bankingRaw.get("accountNumber"));
            if (bankingRaw.containsKey("ifscCode")) banking.setIfscCode((String) bankingRaw.get("ifscCode"));
            if (bankingRaw.containsKey("salary")) {
                Number sal = (Number) bankingRaw.get("salary");
                banking.setSalary(sal.doubleValue());
            }
            emp.setBankingInfo(banking);
        }

        Employee saved = employeeRepository.save(emp);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", saved));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Current password and new password are required"));
        }

        String email = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "User not authenticated"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Current password does not match"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully"));
    }

    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("image") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Image file cannot be empty"));
        }

        String email = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || userOpt.get().getEmployeeId() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, "Action not allowed"));
        }

        try {
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String savedFileName = System.currentTimeMillis() + "_" + originalFileName;
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().resolve(savedFileName);
            
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/api/uploads/" + savedFileName; // mapped with context path /api

            // Save to employee profile
            Optional<Employee> empOpt = employeeRepository.findById(userOpt.get().getEmployeeId());
            if (empOpt.isPresent()) {
                Employee emp = empOpt.get();
                emp.setProfilePic(imageUrl);
                employeeRepository.save(emp);
            }

            return ResponseEntity.ok(new ApiResponse<>(true, "Profile image updated successfully", Map.of("url", imageUrl)));

        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to upload image: " + ex.getMessage()));
        }
    }
}

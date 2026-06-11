package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.*;
import com.staffbase.repositories.jpa.*;
import com.staffbase.repositories.mongo.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAnyRole('Admin', 'HR')")
public class AdminController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeDocumentRepository documentRepository;
    private final LoginAuditRepository loginAuditRepository;

    public AdminController(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            RoleRepository roleRepository,
            DepartmentRepository departmentRepository,
            SystemSettingRepository systemSettingRepository,
            PasswordEncoder passwordEncoder,
            EmployeeDocumentRepository documentRepository,
            LoginAuditRepository loginAuditRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.passwordEncoder = passwordEncoder;
        this.documentRepository = documentRepository;
        this.loginAuditRepository = loginAuditRepository;
    }

    // --- System Settings APIs ---
    @GetMapping("/settings")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> getSettings() {
        List<SystemSetting> list = systemSettingRepository.findAll();
        if (list.isEmpty()) {
            SystemSetting defaultSetting = new SystemSetting("StaffBase Inc.", 30, false);
            SystemSetting saved = systemSettingRepository.save(defaultSetting);
            return ResponseEntity.ok(new ApiResponse<>(true, "Default settings loaded", saved));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Settings retrieved successfully", list.getFirst()));
    }

    @PostMapping("/settings")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> saveSettings(@RequestBody SystemSetting settings) {
        List<SystemSetting> list = systemSettingRepository.findAll();
        if (!list.isEmpty()) {
            settings.setId(list.getFirst().getId());
        }
        SystemSetting saved = systemSettingRepository.save(settings);
        return ResponseEntity.ok(new ApiResponse<>(true, "System settings saved successfully", saved));
    }

    // --- Department APIs ---
    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments() {
        List<Department> depts = departmentRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Departments retrieved successfully", depts));
    }

    @PostMapping("/departments")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> createDepartment(@RequestBody Department dept) {
        if (dept.getName() == null || dept.getName().trim().isEmpty() ||
            dept.getCode() == null || dept.getCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Department title and code are required"));
        }
        Department saved = departmentRepository.save(dept);
        return ResponseEntity.ok(new ApiResponse<>(true, "Department registered successfully", saved));
    }

    @DeleteMapping("/departments/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> deleteDepartment(@PathVariable String id) {
        if (departmentRepository.existsById(id)) {
            departmentRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Department deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Department not found"));
    }

    // --- User / Admin Management APIs ---
    @GetMapping("/users")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> listUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("email", user.getEmail());
            map.put("role", user.getRole());
            map.put("active", user.isActive());
            map.put("employeeId", user.getEmployeeId());

            if (user.getEmployeeId() != null) {
                Optional<Employee> empOpt = employeeRepository.findById(user.getEmployeeId());
                if (empOpt.isPresent()) {
                    Employee emp = empOpt.get();
                    map.put("name", emp.getName());
                    map.put("designation", emp.getDesignation());
                    map.put("department", emp.getDepartment());
                } else {
                    map.put("name", "System Account");
                }
            } else {
                map.put("name", "System Account");
            }
            responseList.add(map);
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "System users retrieved successfully", responseList));
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String status = body.get("status");
        String requestedRole = body.get("role");

        if (name == null || name.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Name, Email, and Password are required"));
        }

        email = email.trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Email is already registered in directory"));
        }

        // Determine role automatically by email domain suffix
        String roleName = "Employee";
        if (email.endsWith("@admin.com")) {
            roleName = "Admin";
        } else if (email.endsWith("@hr.com")) {
            roleName = "HR";
        } else if (email.endsWith("@employee.com")) {
            roleName = "Employee";
        } else {
            // fallback
            roleName = requestedRole != null ? requestedRole : "Employee";
        }

        // Generate Employee ID
        long count = employeeRepository.count();
        String empId = "EMP-" + (100 + count + 1);

        // Create Employee Profile in MongoDB
        String color = "#3B82F6"; // default blue
        if ("Admin".equalsIgnoreCase(roleName)) {
            color = "#EF4444"; // red
        } else if ("HR".equalsIgnoreCase(roleName)) {
            color = "#10B981"; // green
        }
        
        Employee emp = new Employee(
                empId,
                name,
                email,
                "Profile initialized by Admin console.",
                "Engineering", // Default
                "Software Engineer", // Default
                new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()),
                "Active".equalsIgnoreCase(status) ? "Active" : "Disabled",
                color
        );
        employeeRepository.save(emp);

        // Create User Account in MySQL
        User newUser = new User(email, passwordEncoder.encode(password), empId);
        newUser.setActive("Active".equalsIgnoreCase(status));

        Role dbRole = roleRepository.findByName(roleName).orElse(null);
        if (dbRole == null) {
            dbRole = roleRepository.findByName("Employee").orElse(null);
        }
        if (dbRole != null) {
            newUser.getRoles().add(dbRole);
        }
        userRepository.save(newUser);

        return ResponseEntity.ok(new ApiResponse<>(true, "User created successfully", emp));
    }

    @PutMapping("/users/{email:.+}/status")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> updateUserStatus(@PathVariable String email, @RequestBody Map<String, Boolean> body) {
        email = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "User not found"));
        }

        User user = userOpt.get();
        boolean active = body.getOrDefault("active", true);
        user.setActive(active);
        userRepository.save(user);

        // Update corresponding employee status
        if (user.getEmployeeId() != null) {
            Optional<Employee> empOpt = employeeRepository.findById(user.getEmployeeId());
            empOpt.ifPresent(emp -> {
                emp.setStatus(active ? "Active" : "Disabled");
                employeeRepository.save(emp);
            });
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "User status updated successfully"));
    }

    @DeleteMapping("/users/{email:.+}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        email = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "User not found"));
        }

        User user = userOpt.get();
        if (user.getEmployeeId() != null) {
            employeeRepository.deleteById(user.getEmployeeId());
        }
        userRepository.delete(user);

        return ResponseEntity.ok(new ApiResponse<>(true, "User deleted successfully"));
    }

    // --- Admin Dashboard & Analytics APIs ---
    @GetMapping("/dashboard/summary")
    public ResponseEntity<?> getDashboardSummary() {
        List<Employee> employees = employeeRepository.findAll();
        long totalEmployees = employees.size();
        long activeEmployees = employees.stream().filter(e -> "Active".equalsIgnoreCase(e.getStatus())).count();
        long probationEmployees = employees.stream().filter(e -> e.getStatus() != null && e.getStatus().toLowerCase().contains("probation")).count();
        
        long pendingDocs = documentRepository.findAll().stream()
                .filter(d -> "Pending".equalsIgnoreCase(d.getStatus())).count();
        
        long deptsCount = departmentRepository.count();
        
        long activeClearances = documentRepository.findAll().stream()
                .filter(d -> "Verified".equalsIgnoreCase(d.getStatus())).count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEmployees", totalEmployees);
        summary.put("activeEmployees", activeEmployees);
        summary.put("employeesOnProbation", probationEmployees);
        summary.put("pendingDocuments", pendingDocs);
        summary.put("departmentsCount", deptsCount);
        summary.put("activeClearances", activeClearances);

        return ResponseEntity.ok(new ApiResponse<>(true, "Admin dashboard summary loaded", summary));
    }

    @GetMapping("/dashboard/departments")
    public ResponseEntity<?> getDashboardDepartments() {
        List<Employee> employees = employeeRepository.findAll();
        Map<String, Integer> deptCounts = new HashMap<>();
        for (Employee emp : employees) {
            String dept = emp.getDepartment();
            if (dept == null || dept.trim().isEmpty()) {
                dept = "Unassigned";
            }
            deptCounts.put(dept, deptCounts.getOrDefault(dept, 0) + 1);
        }
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : deptCounts.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", entry.getKey());
            item.put("value", entry.getValue());
            response.add(item);
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Department statistics retrieved", response));
    }

    @GetMapping("/documents/pending")
    public ResponseEntity<?> getPendingDocuments() {
        List<EmployeeDocument> pending = documentRepository.findAll().stream()
                .filter(d -> "Pending".equalsIgnoreCase(d.getStatus()))
                .toList();
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (EmployeeDocument doc : pending) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", doc.getId());
            map.put("name", doc.getName());
            map.put("type", doc.getType());
            map.put("filePath", doc.getFilePath());
            map.put("status", doc.getStatus());
            map.put("dateUploaded", doc.getDateUploaded());
            map.put("expiryDate", doc.getExpiryDate());
            map.put("employeeId", doc.getEmployeeId());
            
            if (doc.getEmployeeId() != null) {
                employeeRepository.findById(doc.getEmployeeId()).ifPresent(emp -> {
                    map.put("employeeName", emp.getName());
                    map.put("employeeEmail", emp.getEmail());
                });
            }
            response.add(map);
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending verification documents retrieved", response));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalEmployees", employeeRepository.count());
        analytics.put("totalDepartments", departmentRepository.count());
        analytics.put("totalDocuments", documentRepository.count());
        return ResponseEntity.ok(new ApiResponse<>(true, "System analytics retrieved", analytics));
    }

    @GetMapping("/system-summary")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> getSystemSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("os", System.getProperty("os.name"));
        summary.put("jvmVersion", System.getProperty("java.version"));
        summary.put("totalMemory", Runtime.getRuntime().totalMemory());
        summary.put("freeMemory", Runtime.getRuntime().freeMemory());
        return ResponseEntity.ok(new ApiResponse<>(true, "System resource summary retrieved", summary));
    }

    @GetMapping("/users/count")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> getUsersCount() {
        long count = userRepository.count();
        return ResponseEntity.ok(new ApiResponse<>(true, "Users count retrieved", Map.of("count", count)));
    }

    @GetMapping("/activities")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> getActivities() {
        List<LoginAudit> logs = loginAuditRepository.findAllByOrderByTimestampDesc();
        List<LoginAudit> recent = logs.size() > 10 ? logs.subList(0, 10) : logs;
        return ResponseEntity.ok(new ApiResponse<>(true, "Recent system activities retrieved", recent));
    }
}

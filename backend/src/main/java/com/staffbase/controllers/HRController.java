package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.*;
import com.staffbase.repositories.jpa.*;
import com.staffbase.repositories.mongo.*;
import com.staffbase.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/hr")
@PreAuthorize("hasAnyRole('Admin', 'HR')")
public class HRController {

    private final RegistrationRequestRepository registrationRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OnboardingTaskRepository onboardingTaskRepository;
    private final ReportingHierarchyRepository reportingHierarchyRepository;
    private final EmailService emailService;

    public HRController(
            RegistrationRequestRepository registrationRequestRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            OnboardingTaskRepository onboardingTaskRepository,
            ReportingHierarchyRepository reportingHierarchyRepository,
            EmailService emailService) {
        this.registrationRequestRepository = registrationRequestRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.onboardingTaskRepository = onboardingTaskRepository;
        this.reportingHierarchyRepository = reportingHierarchyRepository;
        this.emailService = emailService;
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getPendingRequests() {
        List<RegistrationRequest> list = registrationRequestRepository.findByStatus("PENDING");
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending requests retrieved", list));
    }

    @PostMapping("/requests/{requestId}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable String requestId) {
        Optional<RegistrationRequest> reqOpt = registrationRequestRepository.findById(requestId);
        if (reqOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Registration request not found"));
        }

        RegistrationRequest req = reqOpt.get();

        // Check if user already exists
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "A user with this email has already been provisioned"));
        }

        // 1. Generate Employee ID
        long count = employeeRepository.count();
        String empId = "EMP-" + (100 + count + 1);

        String designation = req.getDesignation();
        if (designation == null || designation.trim().isEmpty()) {
            designation = "Software Engineer";
        }

        // 2. Create Employee profile in MongoDB
        Employee emp = new Employee(
                empId,
                req.getName(),
                req.getEmail(),
                "New recruit onboarded via credentials portal.",
                req.getDepartment(),
                designation,
                new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()),
                "On Probation",
                "#8B5CF6" // Purple
        );
        emp.getTimeline().add(new Employee.TimelineEvent(
                new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()),
                "Joined Corporate Portal",
                "Credentials request approved by HR Operations."
        ));
        Employee savedEmp = employeeRepository.save(emp);

        // 3. Create User account in MySQL (Link with Employee ID)
        User newUser = new User(req.getEmail(), req.getPassword(), empId);
        newUser.setActive(true);
        
        // Determine role automatically by email domain suffix
        String email = req.getEmail().trim().toLowerCase();
        String targetRole = "Employee";
        if (email.endsWith("@admin.com")) {
            targetRole = "Admin";
        } else if (email.endsWith("@hr.com")) {
            targetRole = "HR";
        } else if (email.endsWith("@employee.com")) {
            targetRole = "Employee";
        } else {
            targetRole = req.getRole();
            if (targetRole == null || targetRole.trim().isEmpty()) {
                targetRole = "Employee";
            }
        }
        Role dbRole = roleRepository.findByName(targetRole).orElse(null);
        if (dbRole == null) {
            dbRole = roleRepository.findByName("Employee").orElse(null);
        }
        if (dbRole != null) {
            newUser.getRoles().add(dbRole);
        }
        userRepository.save(newUser);

        // 4. Seed initial Onboarding Tasks in MongoDB
        onboardingTaskRepository.save(new OnboardingTask(empId, "IT Assets & Workspace Provisioning", "Pending"));
        onboardingTaskRepository.save(new OnboardingTask(empId, "Corporate NDA & Security Signoff", "Pending"));
        onboardingTaskRepository.save(new OnboardingTask(empId, "Financial Banking & Payroll Audit", "Pending"));
        onboardingTaskRepository.save(new OnboardingTask(empId, "Formal Orientation & Team Syncs", "Pending"));

        // 5. Setup default reporting hierarchy
        Optional<User> adminUserOpt = userRepository.findAll().stream()
                .filter(u -> "Admin".equalsIgnoreCase(u.getRole()))
                .findFirst();
        String managerId = adminUserOpt.map(User::getEmployeeId).orElse("EMP-101");
        reportingHierarchyRepository.save(new ReportingHierarchy(empId, managerId, req.getDepartment()));

        // 6. Update request status
        req.setStatus("APPROVED");
        registrationRequestRepository.save(req);

        // 7. Dispatch mock email
        emailService.sendAccountApprovalEmail(req.getEmail(), req.getName());

        return ResponseEntity.ok(new ApiResponse<>(true, "Registration request approved", savedEmp));
    }

    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable String requestId) {
        Optional<RegistrationRequest> reqOpt = registrationRequestRepository.findById(requestId);
        if (reqOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Registration request not found"));
        }

        RegistrationRequest req = reqOpt.get();
        req.setStatus("REJECTED");
        registrationRequestRepository.save(req);

        // Dispatch mock email
        emailService.sendAccountRejectionEmail(req.getEmail(), req.getName());

        return ResponseEntity.ok(new ApiResponse<>(true, "Registration request rejected successfully"));
    }

    @GetMapping("/requests/all")
    public ResponseEntity<?> getAllRequests() {
        List<RegistrationRequest> list = registrationRequestRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "All requests history retrieved", list));
    }

    @PutMapping("/employees/{id}/probation")
    public ResponseEntity<?> confirmProbation(@PathVariable String id) {
        Optional<Employee> empOpt = employeeRepository.findById(id);
        if (empOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Employee not found"));
        }

        Employee emp = empOpt.get();
        emp.setStatus("Active");
        emp.getTimeline().add(new Employee.TimelineEvent(
                new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()),
                "Probation Confirmed",
                "Induction pipeline verified and status transitioned to Active."
        ));
        Employee saved = employeeRepository.save(emp);

        return ResponseEntity.ok(new ApiResponse<>(true, "Probation completed successfully", saved));
    }
}

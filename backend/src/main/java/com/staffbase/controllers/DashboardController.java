package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.*;
import com.staffbase.repositories.mongo.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final RegistrationRequestRepository registrationRequestRepository;
    private final EmployeeDocumentRepository documentRepository;

    public DashboardController(
            EmployeeRepository employeeRepository,
            RegistrationRequestRepository registrationRequestRepository,
            EmployeeDocumentRepository documentRepository) {
        this.employeeRepository = employeeRepository;
        this.registrationRequestRepository = registrationRequestRepository;
        this.documentRepository = documentRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<Employee> employees = employeeRepository.findAll();
        long totalEmployees = employees.size();
        long activeEmployees = employees.stream().filter(e -> "Active".equalsIgnoreCase(e.getStatus())).count();
        long probationEmployees = employees.stream().filter(e -> "On Probation".equalsIgnoreCase(e.getStatus())).count();
        long pendingRequests = registrationRequestRepository.count();

        long pendingDocs = documentRepository.findAll().stream()
                .filter(d -> "Pending".equalsIgnoreCase(d.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", totalEmployees);
        stats.put("activeEmployees", activeEmployees);
        stats.put("probationEmployees", probationEmployees);
        stats.put("pendingRequests", pendingRequests);
        stats.put("pendingDocuments", pendingDocs);

        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard stats loaded successfully", stats));
    }
}

package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.Employee;
import com.staffbase.models.ReportingHierarchy;
import com.staffbase.repositories.mongo.EmployeeRepository;
import com.staffbase.repositories.mongo.ReportingHierarchyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/org-chart")
public class OrgChartController {

    private final EmployeeRepository employeeRepository;
    private final ReportingHierarchyRepository reportingHierarchyRepository;

    public OrgChartController(
            EmployeeRepository employeeRepository,
            ReportingHierarchyRepository reportingHierarchyRepository) {
        this.employeeRepository = employeeRepository;
        this.reportingHierarchyRepository = reportingHierarchyRepository;
    }

    @GetMapping
    public ResponseEntity<?> getOrgStructure() {
        List<Employee> list = employeeRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Org structure retrieved", list));
    }

    @GetMapping("/hierarchy")
    public ResponseEntity<?> getHierarchy() {
        List<ReportingHierarchy> list = reportingHierarchyRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Reporting hierarchy retrieved", list));
    }

    @PostMapping("/reporting")
    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    public ResponseEntity<?> createReportingRelationship(@RequestBody ReportingHierarchy relationship) {
        if (relationship.getEmployeeId() == null || relationship.getManagerId() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Employee ID and Manager ID are required"));
        }
        
        // Remove existing relationship for this employee if it exists (an employee has one direct manager)
        Optional<ReportingHierarchy> existing = reportingHierarchyRepository.findByEmployeeId(relationship.getEmployeeId());
        existing.ifPresent(reportingHierarchyRepository::delete);

        ReportingHierarchy saved = reportingHierarchyRepository.save(relationship);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Reporting relationship created", saved));
    }

    @PutMapping("/reporting/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    public ResponseEntity<?> updateReportingRelationship(@PathVariable String id, @RequestBody ReportingHierarchy relationship) {
        Optional<ReportingHierarchy> relOpt = reportingHierarchyRepository.findById(id);
        if (relOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Reporting relationship not found"));
        }

        ReportingHierarchy rel = relOpt.get();
        if (relationship.getEmployeeId() != null) rel.setEmployeeId(relationship.getEmployeeId());
        if (relationship.getManagerId() != null) rel.setManagerId(relationship.getManagerId());
        if (relationship.getDepartment() != null) rel.setDepartment(relationship.getDepartment());

        ReportingHierarchy saved = reportingHierarchyRepository.save(rel);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reporting relationship updated", saved));
    }

    @DeleteMapping("/reporting/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    public ResponseEntity<?> deleteReportingRelationship(@PathVariable String id) {
        if (reportingHierarchyRepository.existsById(id)) {
            reportingHierarchyRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Reporting relationship deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Reporting relationship not found"));
    }
}

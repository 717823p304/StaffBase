package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.Department;
import com.staffbase.models.Employee;
import com.staffbase.models.EmployeeDocument;
import com.staffbase.repositories.mongo.DepartmentRepository;
import com.staffbase.repositories.mongo.EmployeeDocumentRepository;
import com.staffbase.repositories.mongo.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final EmployeeRepository employeeRepository;
    private final EmployeeDocumentRepository documentRepository;
    private final DepartmentRepository departmentRepository;

    public SearchController(
            EmployeeRepository employeeRepository,
            EmployeeDocumentRepository documentRepository,
            DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.documentRepository = documentRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping
    public ResponseEntity<?> searchAll(@RequestParam("q") String query) {
        String keyword = query != null ? query.trim().toLowerCase() : "";
        
        List<Employee> emps = new ArrayList<>();
        List<EmployeeDocument> docs = new ArrayList<>();
        List<Department> depts = new ArrayList<>();

        if (!keyword.isEmpty()) {
            // Search Employees in MongoDB
            emps = employeeRepository.searchEmployees(keyword);
            
            // Search Documents in MongoDB
            for (EmployeeDocument doc : documentRepository.findAll()) {
                if (doc.getName().toLowerCase().contains(keyword)) {
                    docs.add(doc);
                }
            }

            // Search Departments in MongoDB
            for (Department dept : departmentRepository.findAll()) {
                if (dept.getName().toLowerCase().contains(keyword) || 
                    dept.getCode().toLowerCase().contains(keyword)) {
                    depts.add(dept);
                }
            }
        }

        Map<String, Object> results = new HashMap<>();
        results.put("employees", emps);
        results.put("documents", docs);
        results.put("departments", depts);

        return ResponseEntity.ok(new ApiResponse<>(true, "Search operations successful", results));
    }
}

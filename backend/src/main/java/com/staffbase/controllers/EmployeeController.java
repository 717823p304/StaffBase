package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.*;
import com.staffbase.repositories.jpa.*;
import com.staffbase.repositories.mongo.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final EmployeeDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeController(
            EmployeeRepository employeeRepository,
            EmployeeDocumentRepository documentRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<?> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String designation) {
        
        List<Employee> list;
        if (search != null && !search.trim().isEmpty()) {
            list = employeeRepository.searchEmployees(search);
        } else if (department != null && !department.trim().isEmpty()) {
            list = employeeRepository.findByDepartment(department);
        } else if (designation != null && !designation.trim().isEmpty()) {
            list = employeeRepository.findByDesignation(designation);
        } else {
            list = employeeRepository.findAll();
        }

        // Attach documents to each employee profile dynamically
        for (Employee emp : list) {
            List<EmployeeDocument> docs = documentRepository.findByEmployeeId(emp.getId());
            emp.setDocuments(docs);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("employees", list);

        return ResponseEntity.ok(new ApiResponse<>(true, "Employees retrieved successfully", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable String id) {
        Optional<Employee> empOpt = employeeRepository.findById(id);
        if (empOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Employee not found"));
        }

        Employee emp = empOpt.get();
        List<EmployeeDocument> docs = documentRepository.findByEmployeeId(emp.getId());
        emp.setDocuments(docs);

        return ResponseEntity.ok(new ApiResponse<>(true, "Employee retrieved successfully", emp));
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employeeData) {
        // Generate dynamic employee ID
        long count = employeeRepository.count();
        String empId = "EMP-" + (100 + count + 1);
        employeeData.setId(empId);
        
        if (employeeData.getBgColor() == null) {
            employeeData.setBgColor("#3B82F6"); // Default blue
        }
        if (employeeData.getStatus() == null) {
            employeeData.setStatus("On Probation"); // Default status
        }

        Employee saved = employeeRepository.save(employeeData);

        // Provision User Account in MySQL (default password: password123)
        String defaultHashedPassword = passwordEncoder.encode("password123");
        User newUser = new User(employeeData.getEmail(), defaultHashedPassword, empId);
        
        // Find default role (usually Employee)
        Role empRole = roleRepository.findByName("Employee").orElse(null);
        if (empRole != null) {
            newUser.getRoles().add(empRole);
        }
        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Employee created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<Employee> empOpt = employeeRepository.findById(id);
        if (empOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Employee not found"));
        }

        Employee emp = empOpt.get();

        // Update fields if present in updates payload
        if (updates.containsKey("name")) emp.setName((String) updates.get("name"));
        if (updates.containsKey("bio")) emp.setBio((String) updates.get("bio"));
        if (updates.containsKey("department")) emp.setDepartment((String) updates.get("department"));
        if (updates.containsKey("designation")) emp.setDesignation((String) updates.get("designation"));
        
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
            Employee.BankingInfo banking = new Employee.BankingInfo();
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
        List<EmployeeDocument> docs = documentRepository.findByEmployeeId(saved.getId());
        saved.setDocuments(docs);

        return ResponseEntity.ok(new ApiResponse<>(true, "Employee updated successfully", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        Optional<Employee> empOpt = employeeRepository.findById(id);
        if (empOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Employee not found"));
        }

        // Delete from MongoDB
        employeeRepository.deleteById(id);

        // Delete User Account in MySQL
        Optional<User> userOpt = userRepository.findByEmployeeId(id);
        userOpt.ifPresent(userRepository::delete);

        return ResponseEntity.ok(new ApiResponse<>(true, "Employee deleted successfully"));
    }
}

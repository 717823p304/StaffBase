package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.Employee;
import com.staffbase.models.EmployeeDocument;
import com.staffbase.models.Role;
import com.staffbase.models.User;
import com.staffbase.repositories.jpa.RoleRepository;
import com.staffbase.repositories.jpa.UserRepository;
import com.staffbase.repositories.mongo.EmployeeDocumentRepository;
import com.staffbase.repositories.mongo.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeControllerTest {

    @Mock private EmployeeRepository employeeRepository;
    @Mock private EmployeeDocumentRepository documentRepository;
    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder passwordEncoder;

    private EmployeeController employeeController;

    @BeforeEach
    void setUp() {
        employeeController = new EmployeeController(
                employeeRepository, documentRepository, userRepository, roleRepository, passwordEncoder);
    }

    @Test
    void getAllEmployees_noFilters_returnsAllEmployees() {
        Employee emp1 = new Employee();
        emp1.setId("EMP-101");
        emp1.setName("Alice");
        Employee emp2 = new Employee();
        emp2.setId("EMP-102");
        emp2.setName("Bob");

        when(employeeRepository.findAll()).thenReturn(List.of(emp1, emp2));
        when(documentRepository.findByEmployeeId(anyString())).thenReturn(Collections.emptyList());

        ResponseEntity<?> resp = employeeController.getAllEmployees(null, null, null);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        ApiResponse<?> body = (ApiResponse<?>) resp.getBody();
        assertNotNull(body);
        assertTrue(body.isSuccess());
    }

    @Test
    void getAllEmployees_withSearchFilter_callsSearchEmployees() {
        when(employeeRepository.searchEmployees("Alice")).thenReturn(List.of(new Employee()));
        when(documentRepository.findByEmployeeId(any())).thenReturn(Collections.emptyList());

        ResponseEntity<?> resp = employeeController.getAllEmployees("Alice", null, null);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        verify(employeeRepository).searchEmployees("Alice");
        verify(employeeRepository, never()).findAll();
    }

    @Test
    void getAllEmployees_withDepartmentFilter_callsFindByDepartment() {
        when(employeeRepository.findByDepartment("Engineering")).thenReturn(List.of(new Employee()));
        when(documentRepository.findByEmployeeId(any())).thenReturn(Collections.emptyList());

        ResponseEntity<?> resp = employeeController.getAllEmployees(null, "Engineering", null);

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        verify(employeeRepository).findByDepartment("Engineering");
    }

    @Test
    void getAllEmployees_withDesignationFilter_callsFindByDesignation() {
        when(employeeRepository.findByDesignation("Engineer")).thenReturn(List.of(new Employee()));
        when(documentRepository.findByEmployeeId(any())).thenReturn(Collections.emptyList());

        ResponseEntity<?> resp = employeeController.getAllEmployees(null, null, "Engineer");

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        verify(employeeRepository).findByDesignation("Engineer");
    }

    @Test
    void getEmployeeById_existingEmployee_returnsEmployee() {
        Employee emp = new Employee();
        emp.setId("EMP-101");
        emp.setName("Alice");

        when(employeeRepository.findById("EMP-101")).thenReturn(Optional.of(emp));
        when(documentRepository.findByEmployeeId("EMP-101")).thenReturn(Collections.emptyList());

        ResponseEntity<?> resp = employeeController.getEmployeeById("EMP-101");

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        ApiResponse<?> body = (ApiResponse<?>) resp.getBody();
        assertNotNull(body);
        assertTrue(body.isSuccess());
    }

    @Test
    void getEmployeeById_nonExistent_returns404() {
        when(employeeRepository.findById("EMP-999")).thenReturn(Optional.empty());

        ResponseEntity<?> resp = employeeController.getEmployeeById("EMP-999");

        assertEquals(HttpStatus.NOT_FOUND, resp.getStatusCode());
    }

    @Test
    void createEmployee_setsDefaultsAndCreatesUser() {
        Employee input = new Employee();
        input.setName("Charlie");
        input.setEmail("charlie@test.com");

        when(employeeRepository.count()).thenReturn(5L);
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));
        when(passwordEncoder.encode("password123")).thenReturn("hashed-pw");
        Role empRole = new Role();
        empRole.setName("Employee");
        when(roleRepository.findByName("Employee")).thenReturn(Optional.of(empRole));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        ResponseEntity<?> resp = employeeController.createEmployee(input);

        assertEquals(HttpStatus.CREATED, resp.getStatusCode());
        assertEquals("EMP-106", input.getId());
        assertEquals("#3B82F6", input.getBgColor());
        assertEquals("On Probation", input.getStatus());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateEmployee_nonExistent_returns404() {
        when(employeeRepository.findById("EMP-999")).thenReturn(Optional.empty());

        ResponseEntity<?> resp = employeeController.updateEmployee("EMP-999", Map.of("name", "Updated"));

        assertEquals(HttpStatus.NOT_FOUND, resp.getStatusCode());
    }
}

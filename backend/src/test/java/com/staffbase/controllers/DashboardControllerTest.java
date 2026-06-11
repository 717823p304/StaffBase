package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.Employee;
import com.staffbase.models.EmployeeDocument;
import com.staffbase.models.RegistrationRequest;
import com.staffbase.repositories.mongo.EmployeeDocumentRepository;
import com.staffbase.repositories.mongo.EmployeeRepository;
import com.staffbase.repositories.mongo.RegistrationRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    @Mock private EmployeeRepository employeeRepository;
    @Mock private RegistrationRequestRepository registrationRequestRepository;
    @Mock private EmployeeDocumentRepository documentRepository;

    private DashboardController dashboardController;

    @BeforeEach
    void setUp() {
        dashboardController = new DashboardController(
                employeeRepository, registrationRequestRepository, documentRepository);
    }

    @Test
    void getStats_returnsCorrectCounts() {
        Employee active1 = new Employee();
        active1.setStatus("Active");
        Employee active2 = new Employee();
        active2.setStatus("Active");
        Employee probation = new Employee();
        probation.setStatus("On Probation");
        Employee other = new Employee();
        other.setStatus("Inactive");

        when(employeeRepository.findAll()).thenReturn(List.of(active1, active2, probation, other));
        when(registrationRequestRepository.count()).thenReturn(3L);

        EmployeeDocument pendingDoc = new EmployeeDocument();
        pendingDoc.setStatus("Pending");
        EmployeeDocument approvedDoc = new EmployeeDocument();
        approvedDoc.setStatus("Approved");
        when(documentRepository.findAll()).thenReturn(List.of(pendingDoc, approvedDoc));

        ResponseEntity<?> resp = dashboardController.getStats();

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        ApiResponse<?> body = (ApiResponse<?>) resp.getBody();
        assertNotNull(body);
        assertTrue(body.isSuccess());

        @SuppressWarnings("unchecked")
        Map<String, Object> stats = (Map<String, Object>) body.getData();
        assertEquals(4L, stats.get("totalEmployees"));
        assertEquals(2L, stats.get("activeEmployees"));
        assertEquals(1L, stats.get("probationEmployees"));
        assertEquals(3L, stats.get("pendingRequests"));
        assertEquals(1L, stats.get("pendingDocuments"));
    }

    @Test
    void getStats_emptyData_returnsZeroCounts() {
        when(employeeRepository.findAll()).thenReturn(List.of());
        when(registrationRequestRepository.count()).thenReturn(0L);
        when(documentRepository.findAll()).thenReturn(List.of());

        ResponseEntity<?> resp = dashboardController.getStats();

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        ApiResponse<?> body = (ApiResponse<?>) resp.getBody();
        assertNotNull(body);

        @SuppressWarnings("unchecked")
        Map<String, Object> stats = (Map<String, Object>) body.getData();
        assertEquals(0L, stats.get("totalEmployees"));
        assertEquals(0L, stats.get("activeEmployees"));
        assertEquals(0L, stats.get("probationEmployees"));
        assertEquals(0L, stats.get("pendingRequests"));
        assertEquals(0L, stats.get("pendingDocuments"));
    }
}

package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.Employee;
import com.staffbase.models.SupportTicket;
import com.staffbase.models.User;
import com.staffbase.repositories.jpa.UserRepository;
import com.staffbase.repositories.mongo.EmployeeRepository;
import com.staffbase.repositories.mongo.SupportTicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/support")
public class SupportController {

    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public SupportController(
            SupportTicketRepository supportTicketRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository) {
        this.supportTicketRepository = supportTicketRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/tickets")
    public ResponseEntity<?> createTicket(@RequestBody SupportTicket ticket) {
        if (ticket.getSubject() == null || ticket.getMessage() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Subject and Message are required"));
        }

        String email = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(false, "Unauthorized"));
        }

        User user = userOpt.get();
        ticket.setEmployeeId(user.getEmployeeId());
        
        if (user.getEmployeeId() != null) {
            Optional<Employee> empOpt = employeeRepository.findById(user.getEmployeeId());
            empOpt.ifPresent(emp -> ticket.setEmployeeName(emp.getName()));
        }
        
        if (ticket.getEmployeeName() == null) {
            ticket.setEmployeeName("System Account (" + user.getEmail() + ")");
        }

        ticket.setStatus("Open");
        ticket.setCreatedAt(new Date());

        SupportTicket saved = supportTicketRepository.save(ticket);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Support ticket registered successfully", saved));
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> listTickets() {
        String email = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(false, "Unauthorized"));
        }

        User user = userOpt.get();
        List<SupportTicket> tickets;
        
        // Admin or HR see all tickets; regular Employee sees only their own
        if (user.getRoles().stream().anyMatch(role -> "Admin".equalsIgnoreCase(role.getName()) || "HR".equalsIgnoreCase(role.getName()))) {
            tickets = supportTicketRepository.findAll();
        } else {
            tickets = supportTicketRepository.findByEmployeeId(user.getEmployeeId());
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Support tickets retrieved", tickets));
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<?> getTicketDetails(@PathVariable String id) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Support ticket not found"));
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Support ticket details retrieved", ticketOpt.get()));
    }

    @PutMapping("/tickets/{id}/close")
    public ResponseEntity<?> closeTicket(@PathVariable String id) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Support ticket not found"));
        }

        SupportTicket ticket = ticketOpt.get();
        ticket.setStatus("Closed");
        SupportTicket saved = supportTicketRepository.save(ticket);
        return ResponseEntity.ok(new ApiResponse<>(true, "Support ticket resolved and closed", saved));
    }
}

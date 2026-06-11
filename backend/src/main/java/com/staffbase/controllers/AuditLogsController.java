package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.LoginAudit;
import com.staffbase.repositories.jpa.LoginAuditRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@RestController
@RequestMapping("/audit-logs")
@PreAuthorize("hasRole('Admin')")
public class AuditLogsController {

    private final LoginAuditRepository loginAuditRepository;

    public AuditLogsController(LoginAuditRepository loginAuditRepository) {
        this.loginAuditRepository = loginAuditRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAuditLogs() {
        List<LoginAudit> logs = loginAuditRepository.findAllByOrderByTimestampDesc();
        return ResponseEntity.ok(new ApiResponse<>(true, "Login audit logs retrieved successfully", logs));
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentAuditLogs() {
        List<LoginAudit> logs = loginAuditRepository.findAllByOrderByTimestampDesc();
        List<LoginAudit> recent = logs.size() > 10 ? logs.subList(0, 10) : logs;
        return ResponseEntity.ok(new ApiResponse<>(true, "Recent login audits retrieved", recent));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterLogs(@RequestParam(required = false) String email, @RequestParam(required = false) String status) {
        List<LoginAudit> allLogs = loginAuditRepository.findAllByOrderByTimestampDesc();
        List<LoginAudit> filtered = new ArrayList<>();

        for (LoginAudit log : allLogs) {
            boolean matchesEmail = (email == null || email.trim().isEmpty() || 
                                    log.getEmail().toLowerCase().contains(email.trim().toLowerCase()));
            boolean matchesStatus = (status == null || status.trim().isEmpty() || 
                                     log.getStatus().equalsIgnoreCase(status.trim()));
            if (matchesEmail && matchesStatus) {
                filtered.add(log);
            }
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Filtered login audit logs retrieved", filtered));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUserActivities() {
        List<LoginAudit> allLogs = loginAuditRepository.findAllByOrderByTimestampDesc();
        Map<String, Map<String, Integer>> userCounts = new HashMap<>();

        for (LoginAudit log : allLogs) {
            String email = log.getEmail();
            userCounts.putIfAbsent(email, new HashMap<>(Map.of("success", 0, "failure", 0)));
            Map<String, Integer> stats = userCounts.get(email);
            if ("SUCCESS".equalsIgnoreCase(log.getStatus())) {
                stats.put("success", stats.get("success") + 1);
            } else {
                stats.put("failure", stats.get("failure") + 1);
            }
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Map.Entry<String, Map<String, Integer>> entry : userCounts.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("email", entry.getKey());
            map.put("successCount", entry.getValue().get("success"));
            map.put("failureCount", entry.getValue().get("failure"));
            response.add(map);
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "User activity statistics compiled", response));
    }

    @GetMapping("/login-history")
    public ResponseEntity<?> getLoginHistory() {
        List<LoginAudit> allLogs = loginAuditRepository.findAllByOrderByTimestampDesc();
        long success = allLogs.stream().filter(l -> "SUCCESS".equalsIgnoreCase(l.getStatus())).count();
        long failure = allLogs.stream().filter(l -> "FAILURE".equalsIgnoreCase(l.getStatus())).count();

        Map<String, Object> history = new HashMap<>();
        history.put("totalLogins", allLogs.size());
        history.put("successfulLogins", success);
        history.put("failedLogins", failure);
        if (!allLogs.isEmpty()) {
            history.put("lastLoginTime", allLogs.getFirst().getTimestamp());
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Login history summary compiled", history));
    }
}

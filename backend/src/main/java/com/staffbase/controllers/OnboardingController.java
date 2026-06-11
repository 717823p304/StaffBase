package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.OnboardingTask;
import com.staffbase.repositories.mongo.OnboardingTaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/onboarding")
public class OnboardingController {

    private final OnboardingTaskRepository onboardingTaskRepository;

    public OnboardingController(OnboardingTaskRepository onboardingTaskRepository) {
        this.onboardingTaskRepository = onboardingTaskRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    public ResponseEntity<?> createOnboardingTask(@RequestBody OnboardingTask task) {
        if (task.getEmployeeId() == null || task.getTaskName() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Employee ID and task name are required"));
        }
        if (task.getStatus() == null) {
            task.setStatus("Pending");
        }
        OnboardingTask saved = onboardingTaskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Onboarding task created successfully", saved));
    }

    @GetMapping
    public ResponseEntity<?> getOnboardingTasks(@RequestParam(required = false) String employeeId) {
        List<OnboardingTask> tasks;
        if (employeeId != null && !employeeId.trim().isEmpty()) {
            tasks = onboardingTaskRepository.findByEmployeeId(employeeId);
        } else {
            tasks = onboardingTaskRepository.findAll();
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Onboarding tasks retrieved", tasks));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOnboardingTask(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<OnboardingTask> taskOpt = onboardingTaskRepository.findById(id);
        if (taskOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Onboarding task not found"));
        }

        OnboardingTask task = taskOpt.get();
        String status = body.get("status");
        if (status != null) {
            task.setStatus(status);
            if ("Completed".equalsIgnoreCase(status)) {
                task.setCompletedDate(new Date());
            } else {
                task.setCompletedDate(null);
            }
        }
        
        String taskName = body.get("taskName");
        if (taskName != null) {
            task.setTaskName(taskName);
        }

        OnboardingTask saved = onboardingTaskRepository.save(task);
        return ResponseEntity.ok(new ApiResponse<>(true, "Onboarding task status updated", saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'HR')")
    public ResponseEntity<?> deleteOnboardingTask(@PathVariable String id) {
        if (onboardingTaskRepository.existsById(id)) {
            onboardingTaskRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Onboarding task deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Onboarding task not found"));
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getOnboardingProgress() {
        List<OnboardingTask> allTasks = onboardingTaskRepository.findAll();
        
        // Group tasks by Employee ID
        Map<String, Map<String, Integer>> counts = new HashMap<>();
        for (OnboardingTask task : allTasks) {
            String empId = task.getEmployeeId();
            counts.putIfAbsent(empId, new HashMap<>(Map.of("total", 0, "completed", 0)));
            
            Map<String, Integer> stats = counts.get(empId);
            stats.put("total", stats.get("total") + 1);
            if ("Completed".equalsIgnoreCase(task.getStatus())) {
                stats.put("completed", stats.get("completed") + 1);
            }
        }

        List<Map<String, Object>> progressList = new ArrayList<>();
        for (Map.Entry<String, Map<String, Integer>> entry : counts.entrySet()) {
            Map<String, Object> progress = new HashMap<>();
            progress.put("employeeId", entry.getKey());
            progress.put("totalTasks", entry.getValue().get("total"));
            progress.put("completedTasks", entry.getValue().get("completed"));
            
            double rate = entry.getValue().get("total") > 0 ? 
                    (entry.getValue().get("completed") * 100.0 / entry.getValue().get("total")) : 0.0;
            progress.put("completionRate", Math.round(rate));
            progressList.add(progress);
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Onboarding progress statistics calculated", progressList));
    }
}

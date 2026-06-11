package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.EmployeeDocument;
import com.staffbase.models.Notification;
import com.staffbase.repositories.mongo.EmployeeDocumentRepository;
import com.staffbase.repositories.mongo.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final EmployeeDocumentRepository documentRepository;

    public NotificationController(
            NotificationRepository notificationRepository,
            EmployeeDocumentRepository documentRepository) {
        this.notificationRepository = notificationRepository;
        this.documentRepository = documentRepository;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications() {
        // Fetch saved notifications
        List<Notification> saved = notificationRepository.findByEmployeeIdIsNullOrderByTimestampDesc();

        // Dynamically compute document expiry alerts
        List<Map<String, String>> expiryAlerts = new ArrayList<>();
        List<EmployeeDocument> docs = documentRepository.findAll();
        for (EmployeeDocument doc : docs) {
            if (doc.getExpiryDate() != null && !doc.getExpiryDate().equals("N/A")) {
                // Generate a warning alert if a document is expiring
                Map<String, String> alert = new HashMap<>();
                alert.put("id", "alert-" + doc.getId());
                alert.put("title", "Document Expiration Warning");
                alert.put("message", "Document \"" + doc.getName() + "\" is scheduled to expire on " + doc.getExpiryDate());
                alert.put("type", "warning");
                expiryAlerts.add(alert);
            }
        }

        Map<String, Object> data = new HashMap<>();
        data.put("savedNotifications", saved);
        data.put("expiryAlerts", expiryAlerts);

        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications retrieved successfully", data));
    }
}

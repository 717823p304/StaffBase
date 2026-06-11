package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "support_tickets")
public class SupportTicket {
    @Id
    private String id;
    private String employeeId;
    private String employeeName;
    private String category; // "IT Support", "HR Operations", "Finance / Payroll", "General"
    private String subject;
    private String message;
    private String status = "Open"; // "Open", "Closed"
    private Date createdAt = new Date();

    public SupportTicket() {}

    public SupportTicket(String employeeId, String employeeName, String category, String subject, String message) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.category = category;
        this.subject = subject;
        this.message = message;
        this.status = "Open";
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}

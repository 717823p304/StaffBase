package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "documents")
public class EmployeeDocument {
    @Id
    private String id;
    private String name;
    private String type; // e.g. "PDF", "PNG", "JPG"
    private String filePath;
    private String status; // "Verified", "Pending", "Rejected"
    private String dateUploaded; // date format, e.g. "2026-06-05"
    private String expiryDate; // expiration date, e.g. "2027-06-05" or "N/A"
    private String employeeId; // links to employee

    public EmployeeDocument() {}

    public EmployeeDocument(String name, String type, String filePath, String status, String dateUploaded, String expiryDate, String employeeId) {
        this.name = name;
        this.type = type;
        this.filePath = filePath;
        this.status = status;
        this.dateUploaded = dateUploaded;
        this.expiryDate = expiryDate;
        this.employeeId = employeeId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDateUploaded() { return dateUploaded; }
    public void setDateUploaded(String dateUploaded) { this.dateUploaded = dateUploaded; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
}

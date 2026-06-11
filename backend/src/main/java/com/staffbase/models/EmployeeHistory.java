package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "employee_history")
public class EmployeeHistory {
    @Id
    private String id;
    private String employeeId;
    private String changeType; // e.g. "PROMOTION", "DEPARTMENT_TRANSFER", "BIO_UPDATE"
    private String details;
    private String changedBy;
    private Date changedAt = new Date();

    public EmployeeHistory() {}

    public EmployeeHistory(String employeeId, String changeType, String details, String changedBy) {
        this.employeeId = employeeId;
        this.changeType = changeType;
        this.details = details;
        this.changedBy = changedBy;
        this.changedAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getChangeType() { return changeType; }
    public void setChangeType(String changeType) { this.changeType = changeType; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public Date getChangedAt() { return changedAt; }
    public void setChangedAt(Date changedAt) { this.changedAt = changedAt; }
}

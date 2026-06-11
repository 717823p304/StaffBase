package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reporting_hierarchy")
public class ReportingHierarchy {
    @Id
    private String id;
    private String employeeId;
    private String managerId; // References employeeId of manager
    private String department;

    public ReportingHierarchy() {}

    public ReportingHierarchy(String employeeId, String managerId, String department) {
        this.employeeId = employeeId;
        this.managerId = managerId;
        this.department = department;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getManagerId() { return managerId; }
    public void setManagerId(String managerId) { this.managerId = managerId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}

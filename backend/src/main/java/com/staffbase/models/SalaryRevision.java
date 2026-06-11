package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "salary_revisions")
public class SalaryRevision {
    @Id
    private String id;
    private String employeeId;
    private double previousSalary;
    private double newSalary;
    private Date revisedDate = new Date();
    private String approvedBy;
    private String remarks;

    public SalaryRevision() {}

    public SalaryRevision(String employeeId, double previousSalary, double newSalary, String approvedBy, String remarks) {
        this.employeeId = employeeId;
        this.previousSalary = previousSalary;
        this.newSalary = newSalary;
        this.approvedBy = approvedBy;
        this.remarks = remarks;
        this.revisedDate = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public double getPreviousSalary() { return previousSalary; }
    public void setPreviousSalary(double previousSalary) { this.previousSalary = previousSalary; }

    public double getNewSalary() { return newSalary; }
    public void setNewSalary(double newSalary) { this.newSalary = newSalary; }

    public Date getRevisedDate() { return revisedDate; }
    public void setRevisedDate(Date revisedDate) { this.revisedDate = revisedDate; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

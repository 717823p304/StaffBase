package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "onboarding_tasks")
public class OnboardingTask {
    @Id
    private String id;
    private String employeeId;
    private String taskName;
    private String status; // "Completed", "Pending"
    private Date assignedDate = new Date();
    private Date completedDate;

    public OnboardingTask() {}

    public OnboardingTask(String employeeId, String taskName, String status) {
        this.employeeId = employeeId;
        this.taskName = taskName;
        this.status = status;
        this.assignedDate = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getAssignedDate() { return assignedDate; }
    public void setAssignedDate(Date assignedDate) { this.assignedDate = assignedDate; }

    public Date getCompletedDate() { return completedDate; }
    public void setCompletedDate(Date completedDate) { this.completedDate = completedDate; }
}

package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "registration_requests")
public class RegistrationRequest {
    @Id
    private String id;
    private String name;
    private String email;
    private String password; // hashed temporarily or stored till approved
    private String department;
    private String designation;
    private String role;
    private String status = "PENDING";
    private Date timestamp = new Date();

    public RegistrationRequest() {}

    public RegistrationRequest(String name, String email, String password, String department, String designation, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.department = department;
        this.designation = designation;
        this.role = role;
        this.timestamp = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}

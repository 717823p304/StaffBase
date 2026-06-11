package com.staffbase.models;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "login_audit")
public class LoginAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    @Column(nullable = false)
    private String status; // "SUCCESS", "FAILURE"

    private String ipAddress;

    @Column(length = 500)
    private String details;

    public LoginAudit() {}

    public LoginAudit(String email, String status, String ipAddress, String details) {
        this.email = email;
        this.status = status;
        this.ipAddress = ipAddress;
        this.details = details;
        this.timestamp = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}

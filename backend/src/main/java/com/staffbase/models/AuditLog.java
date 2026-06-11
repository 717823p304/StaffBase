package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    private String action;
    private String user; // actor email
    private Date timestamp = new Date();
    private String details;
    private String ipAddress;

    public AuditLog() {}

    public AuditLog(String action, String user, String details, String ipAddress) {
        this.action = action;
        this.user = user;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}

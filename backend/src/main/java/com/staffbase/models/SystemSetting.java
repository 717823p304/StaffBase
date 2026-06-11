package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "system_settings")
public class SystemSetting {
    @Id
    private String id;
    private String companyName = "StaffBase Inc.";
    private int sessionTimeoutMinutes = 30;
    private boolean enableMfa = false;

    public SystemSetting() {}

    public SystemSetting(String companyName, int sessionTimeoutMinutes, boolean enableMfa) {
        this.companyName = companyName;
        this.sessionTimeoutMinutes = sessionTimeoutMinutes;
        this.enableMfa = enableMfa;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public int getSessionTimeoutMinutes() { return sessionTimeoutMinutes; }
    public void setSessionTimeoutMinutes(int sessionTimeoutMinutes) { this.sessionTimeoutMinutes = sessionTimeoutMinutes; }

    public boolean isEnableMfa() { return enableMfa; }
    public void setEnableMfa(boolean enableMfa) { this.enableMfa = enableMfa; }
}

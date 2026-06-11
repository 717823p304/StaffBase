package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "analytics_reports")
public class AnalyticsReport {
    @Id
    private String id;
    private String reportName;
    private String generatedBy;
    private Date generatedAt = new Date();
    private String reportType; // e.g. "DIVERSITY", "PAYROLL", "RETENTION"
    private String content; // JSON content or CSV content represented as String

    public AnalyticsReport() {}

    public AnalyticsReport(String reportName, String generatedBy, String reportType, String content) {
        this.reportName = reportName;
        this.generatedBy = generatedBy;
        this.reportType = reportType;
        this.content = content;
        this.generatedAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReportName() { return reportName; }
    public void setReportName(String reportName) { this.reportName = reportName; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public Date getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(Date generatedAt) { this.generatedAt = generatedAt; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}

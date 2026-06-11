package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "document_access_logs")
public class DocumentAccessLog {
    @Id
    private String id;
    private String documentId;
    private String accessedBy; // email
    private String accessType; // "UPLOAD", "VIEW", "DOWNLOAD", "VERIFY"
    private Date accessedAt = new Date();

    public DocumentAccessLog() {}

    public DocumentAccessLog(String documentId, String accessedBy, String accessType) {
        this.documentId = documentId;
        this.accessedBy = accessedBy;
        this.accessType = accessType;
        this.accessedAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }

    public String getAccessedBy() { return accessedBy; }
    public void setAccessedBy(String accessedBy) { this.accessedBy = accessedBy; }

    public String getAccessType() { return accessType; }
    public void setAccessType(String accessType) { this.accessType = accessType; }

    public Date getAccessedAt() { return accessedAt; }
    public void setAccessedAt(Date accessedAt) { this.accessedAt = accessedAt; }
}

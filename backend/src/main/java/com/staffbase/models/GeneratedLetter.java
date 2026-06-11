package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "generated_letters")
public class GeneratedLetter {
    @Id
    private String id;
    private String employeeId;
    private String letterType; // "OFFER_LETTER", "EXPERIENCE_LETTER", "CONFIRMATION_LETTER"
    private Date issuedDate = new Date();
    private String content; // Letter HTML / text body

    public GeneratedLetter() {}

    public GeneratedLetter(String employeeId, String letterType, String content) {
        this.employeeId = employeeId;
        this.letterType = letterType;
        this.content = content;
        this.issuedDate = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getLetterType() { return letterType; }
    public void setLetterType(String letterType) { this.letterType = letterType; }

    public Date getIssuedDate() { return issuedDate; }
    public void setIssuedDate(Date issuedDate) { this.issuedDate = issuedDate; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}

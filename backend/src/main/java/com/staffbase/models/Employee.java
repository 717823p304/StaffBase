package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "employees")
public class Employee {
    @Id
    private String id; // e.g. "EMP-101"
    private String name;
    private String email;
    private String bio;
    private String department;
    private String designation;
    private String dateOfJoining;
    private String status; // "Active", "On Probation", "Terminated"
    private String bgColor; // e.g. "#10B981"
    private String profilePic;
    private List<String> skills = new ArrayList<>();
    private List<EmergencyContact> emergencyContacts = new ArrayList<>();
    private BankingInfo bankingInfo;
    private List<TimelineEvent> timeline = new ArrayList<>();

    @Transient
    private List<EmployeeDocument> documents = new ArrayList<>();

    public Employee() {}

    public Employee(String id, String name, String email, String bio, String department, String designation, String dateOfJoining, String status, String bgColor) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.department = department;
        this.designation = designation;
        this.dateOfJoining = dateOfJoining;
        this.status = status;
        this.bgColor = bgColor;
        this.bankingInfo = new BankingInfo();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getDateOfJoining() { return dateOfJoining; }
    public void setDateOfJoining(String dateOfJoining) { this.dateOfJoining = dateOfJoining; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBgColor() { return bgColor; }
    public void setBgColor(String bgColor) { this.bgColor = bgColor; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<EmergencyContact> getEmergencyContacts() { return emergencyContacts; }
    public void setEmergencyContacts(List<EmergencyContact> emergencyContacts) { this.emergencyContacts = emergencyContacts; }

    public BankingInfo getBankingInfo() { return bankingInfo; }
    public void setBankingInfo(BankingInfo bankingInfo) { this.bankingInfo = bankingInfo; }

    public List<TimelineEvent> getTimeline() { return timeline; }
    public void setTimeline(List<TimelineEvent> timeline) { this.timeline = timeline; }

    public List<EmployeeDocument> getDocuments() { return documents; }
    public void setDocuments(List<EmployeeDocument> documents) { this.documents = documents; }

    // Nested Helper Classes
    public static class EmergencyContact {
        private String name;
        private String relationship;
        private String phone;
        private String email;

        public EmergencyContact() {}

        public EmergencyContact(String name, String relationship, String phone, String email) {
            this.name = name;
            this.relationship = relationship;
            this.phone = phone;
            this.email = email;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getRelationship() { return relationship; }
        public void setRelationship(String relationship) { this.relationship = relationship; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class BankingInfo {
        private String bankName;
        private String accountName;
        private String accountNumber;
        private String ifscCode;
        private double salary;

        public BankingInfo() {}

        public BankingInfo(String bankName, String accountName, String accountNumber, String ifscCode, double salary) {
            this.bankName = bankName;
            this.accountName = accountName;
            this.accountNumber = accountNumber;
            this.ifscCode = ifscCode;
            this.salary = salary;
        }

        public String getBankName() { return bankName; }
        public void setBankName(String bankName) { this.bankName = bankName; }

        public String getAccountName() { return accountName; }
        public void setAccountName(String accountName) { this.accountName = accountName; }

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

        public String getIfscCode() { return ifscCode; }
        public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

        public double getSalary() { return salary; }
        public void setSalary(double salary) { this.salary = salary; }
    }

    public static class TimelineEvent {
        private String date;
        private String title;
        private String desc;

        public TimelineEvent() {}

        public TimelineEvent(String date, String title, String desc) {
            this.date = date;
            this.title = title;
            this.desc = desc;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDesc() { return desc; }
        public void setDesc(String desc) { this.desc = desc; }
    }
}

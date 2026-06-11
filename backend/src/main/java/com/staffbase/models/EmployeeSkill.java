package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "employee_skills")
public class EmployeeSkill {
    @Id
    private String id;
    private String employeeId;
    private String skillName;
    private String proficiencyLevel; // "Beginner", "Intermediate", "Expert"
    private int yearsOfExperience;

    public EmployeeSkill() {}

    public EmployeeSkill(String employeeId, String skillName, String proficiencyLevel, int yearsOfExperience) {
        this.employeeId = employeeId;
        this.skillName = skillName;
        this.proficiencyLevel = proficiencyLevel;
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public int getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(int yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
}

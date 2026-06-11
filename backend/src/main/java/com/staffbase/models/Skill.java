package com.staffbase.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "skills")
public class Skill {
    @Id
    private String id;
    private String name; // e.g. "Java", "Spring Boot", "React"
    private String category; // e.g. "Languages", "Frameworks", "Databases"

    public Skill() {}

    public Skill(String name, String category) {
        this.name = name;
        this.category = category;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}

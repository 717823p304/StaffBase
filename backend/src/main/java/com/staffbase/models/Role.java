package com.staffbase.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // e.g. "Employee", "HR Manager", "Admin"

    private String color; // e.g. "var(--info)"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"))
    private List<Permission> permissions = new ArrayList<>();

    public Role() {}

    public Role(String name, String color, List<Permission> permissions) {
        this.name = name;
        this.color = color;
        this.permissions = permissions;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<Permission> getPermissions() { return permissions; }
    public void setPermissions(List<Permission> permissions) { this.permissions = permissions; }

    @Embeddable
    public static class Permission {
        private String name;
        private boolean active;

        public Permission() {}

        public Permission(String name, boolean active) {
            this.name = name;
            this.active = active;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
    }
}

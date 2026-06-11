package com.staffbase.models;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // hashed BCrypt

    private boolean active = true;

    private boolean googleUser = false;

    private String employeeId; // references MongoDB employee profile id

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    public User() {}

    public User(String email, String password, String employeeId) {
        this.email = email;
        this.password = password;
        this.employeeId = employeeId;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isGoogleUser() { return googleUser; }
    public void setGoogleUser(boolean googleUser) { this.googleUser = googleUser; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    // Bridge methods for React frontend compatibility (expects a single role string)
    public String getRole() {
        if (roles != null && !roles.isEmpty()) {
            return roles.iterator().next().getName();
        }
        return "Employee"; // Default fallback
    }

    public void setRole(String roleName) {
        // Will be populated dynamically in service/controller/seeder
    }
}

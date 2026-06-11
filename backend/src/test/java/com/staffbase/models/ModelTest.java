package com.staffbase.models;

import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class ModelTest {

    // --- User Model Tests ---

    @Test
    void user_constructorAndGetters() {
        User user = new User("test@example.com", "hashed", "EMP-101");

        assertEquals("test@example.com", user.getEmail());
        assertEquals("hashed", user.getPassword());
        assertEquals("EMP-101", user.getEmployeeId());
        assertTrue(user.isActive());
        assertFalse(user.isGoogleUser());
    }

    @Test
    void user_setters() {
        User user = new User();
        user.setId(1L);
        user.setEmail("updated@email.com");
        user.setPassword("newHash");
        user.setActive(false);
        user.setGoogleUser(true);
        user.setEmployeeId("EMP-200");

        assertEquals(1L, user.getId());
        assertEquals("updated@email.com", user.getEmail());
        assertEquals("newHash", user.getPassword());
        assertFalse(user.isActive());
        assertTrue(user.isGoogleUser());
        assertEquals("EMP-200", user.getEmployeeId());
    }

    @Test
    void user_getRole_returnsFirstRoleName() {
        User user = new User();
        Role role = new Role();
        role.setName("Admin");
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        assertEquals("Admin", user.getRole());
    }

    @Test
    void user_getRole_defaultsToEmployee() {
        User user = new User();
        assertEquals("Employee", user.getRole());
    }

    // --- Role Model Tests ---

    @Test
    void role_constructorAndGetters() {
        List<Role.Permission> perms = List.of(
                new Role.Permission("view_dashboard", true),
                new Role.Permission("manage_users", false));
        Role role = new Role("Admin", "var(--info)", perms);

        assertEquals("Admin", role.getName());
        assertEquals("var(--info)", role.getColor());
        assertEquals(2, role.getPermissions().size());
    }

    @Test
    void role_setters() {
        Role role = new Role();
        role.setId(1L);
        role.setName("HR");
        role.setColor("#FF0000");
        role.setPermissions(new ArrayList<>());

        assertEquals(1L, role.getId());
        assertEquals("HR", role.getName());
        assertEquals("#FF0000", role.getColor());
        assertTrue(role.getPermissions().isEmpty());
    }

    @Test
    void permission_constructorAndGetters() {
        Role.Permission perm = new Role.Permission("manage_employees", true);

        assertEquals("manage_employees", perm.getName());
        assertTrue(perm.isActive());
    }

    @Test
    void permission_setters() {
        Role.Permission perm = new Role.Permission();
        perm.setName("view_reports");
        perm.setActive(false);

        assertEquals("view_reports", perm.getName());
        assertFalse(perm.isActive());
    }

    // --- RefreshToken Model Tests ---

    @Test
    void refreshToken_constructorAndGetters() {
        User user = new User("u@test.com", "pw", null);
        Instant expiry = Instant.now().plusSeconds(3600);
        RefreshToken rt = new RefreshToken("token123", user, expiry);

        assertEquals("token123", rt.getToken());
        assertEquals(user, rt.getUser());
        assertEquals(expiry, rt.getExpiryDate());
    }

    @Test
    void refreshToken_setters() {
        RefreshToken rt = new RefreshToken();
        rt.setId(5L);
        rt.setToken("newToken");
        User user = new User();
        rt.setUser(user);
        Instant now = Instant.now();
        rt.setExpiryDate(now);

        assertEquals(5L, rt.getId());
        assertEquals("newToken", rt.getToken());
        assertEquals(user, rt.getUser());
        assertEquals(now, rt.getExpiryDate());
    }
}

package com.staffbase.security;

import com.staffbase.models.Role;
import com.staffbase.models.User;
import com.staffbase.repositories.jpa.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() {
        userDetailsService = new UserDetailsServiceImpl(userRepository);
    }

    @Test
    void loadUserByUsername_existingActiveUser_returnsUserDetails() {
        User user = new User("admin@test.com", "hashedPass", "EMP-101");
        user.setActive(true);
        Role role = new Role();
        role.setName("Admin");
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserByUsername("admin@test.com");

        assertEquals("admin@test.com", details.getUsername());
        assertEquals("hashedPass", details.getPassword());
        assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_Admin")));
    }

    @Test
    void loadUserByUsername_nonExistentUser_throwsUsernameNotFoundException() {
        when(userRepository.findByEmail("nobody@test.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("nobody@test.com"));
    }

    @Test
    void loadUserByUsername_inactiveUser_throwsRuntimeException() {
        User user = new User("inactive@test.com", "hashedPass", "EMP-102");
        user.setActive(false);

        when(userRepository.findByEmail("inactive@test.com")).thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userDetailsService.loadUserByUsername("inactive@test.com"));
        assertTrue(ex.getMessage().contains("inactive"));
    }

    @Test
    void loadUserByUsername_userWithDefaultRole_returnsEmployeeAuthority() {
        User user = new User("emp@test.com", "hashedPass", "EMP-103");
        user.setActive(true);
        // No explicit roles set; getRole() returns "Employee" by default

        when(userRepository.findByEmail("emp@test.com")).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserByUsername("emp@test.com");

        assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_Employee")));
    }
}

package com.staffbase.repositories.jpa;

import com.staffbase.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.employeeId = ?1")
    Optional<User> findByEmployeeId(String employeeId);
}

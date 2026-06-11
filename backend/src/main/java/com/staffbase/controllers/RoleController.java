package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.Role;
import com.staffbase.repositories.jpa.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public ResponseEntity<?> getRoles() {
        List<Role> roles = roleRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Clearance roles retrieved successfully", roles));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRolePermissions(@PathVariable Long id, @RequestBody List<Role.Permission> permissions) {
        Optional<Role> roleOpt = roleRepository.findById(id);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Clearance role not found"));
        }

        Role role = roleOpt.get();
        role.setPermissions(permissions);
        Role saved = roleRepository.save(role);

        return ResponseEntity.ok(new ApiResponse<>(true, "Clearance role permissions updated successfully", saved));
    }
}

package com.staffbase.repositories.mongo;

import com.staffbase.models.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DepartmentRepository extends MongoRepository<Department, String> {
    Optional<Department> findByName(String name);
}

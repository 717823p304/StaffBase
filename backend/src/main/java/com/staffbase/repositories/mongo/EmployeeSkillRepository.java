package com.staffbase.repositories.mongo;

import com.staffbase.models.EmployeeSkill;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EmployeeSkillRepository extends MongoRepository<EmployeeSkill, String> {
    List<EmployeeSkill> findByEmployeeId(String employeeId);
}

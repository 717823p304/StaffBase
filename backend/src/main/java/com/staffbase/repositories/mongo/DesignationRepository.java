package com.staffbase.repositories.mongo;

import com.staffbase.models.Designation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DesignationRepository extends MongoRepository<Designation, String> {
    List<Designation> findByDepartment(String department);
}

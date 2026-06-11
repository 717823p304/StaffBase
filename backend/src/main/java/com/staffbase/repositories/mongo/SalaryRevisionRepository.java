package com.staffbase.repositories.mongo;

import com.staffbase.models.SalaryRevision;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SalaryRevisionRepository extends MongoRepository<SalaryRevision, String> {
    List<SalaryRevision> findByEmployeeIdOrderByRevisedDateDesc(String employeeId);
}

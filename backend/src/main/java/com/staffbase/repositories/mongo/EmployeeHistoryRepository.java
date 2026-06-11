package com.staffbase.repositories.mongo;

import com.staffbase.models.EmployeeHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EmployeeHistoryRepository extends MongoRepository<EmployeeHistory, String> {
    List<EmployeeHistory> findByEmployeeIdOrderByChangedAtDesc(String employeeId);
}

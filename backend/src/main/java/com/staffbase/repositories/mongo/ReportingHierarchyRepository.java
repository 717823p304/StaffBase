package com.staffbase.repositories.mongo;

import com.staffbase.models.ReportingHierarchy;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ReportingHierarchyRepository extends MongoRepository<ReportingHierarchy, String> {
    Optional<ReportingHierarchy> findByEmployeeId(String employeeId);
    List<ReportingHierarchy> findByManagerId(String managerId);
}

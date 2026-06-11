package com.staffbase.repositories.mongo;

import com.staffbase.models.EmployeeDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EmployeeDocumentRepository extends MongoRepository<EmployeeDocument, String> {
    List<EmployeeDocument> findByEmployeeId(String employeeId);
}

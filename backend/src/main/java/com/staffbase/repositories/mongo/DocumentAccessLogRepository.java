package com.staffbase.repositories.mongo;

import com.staffbase.models.DocumentAccessLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DocumentAccessLogRepository extends MongoRepository<DocumentAccessLog, String> {
    List<DocumentAccessLog> findByDocumentIdOrderByAccessedAtDesc(String documentId);
}

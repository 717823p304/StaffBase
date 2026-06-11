package com.staffbase.repositories.mongo;

import com.staffbase.models.GeneratedLetter;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GeneratedLetterRepository extends MongoRepository<GeneratedLetter, String> {
    List<GeneratedLetter> findByEmployeeId(String employeeId);
}

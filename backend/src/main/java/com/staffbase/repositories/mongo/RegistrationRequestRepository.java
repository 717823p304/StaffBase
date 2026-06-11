package com.staffbase.repositories.mongo;

import com.staffbase.models.RegistrationRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface RegistrationRequestRepository extends MongoRepository<RegistrationRequest, String> {
    Optional<RegistrationRequest> findByEmail(String email);
    Optional<RegistrationRequest> findByEmailAndStatus(String email, String status);
    List<RegistrationRequest> findByStatus(String status);
}

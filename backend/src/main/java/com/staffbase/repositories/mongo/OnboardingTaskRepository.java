package com.staffbase.repositories.mongo;

import com.staffbase.models.OnboardingTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OnboardingTaskRepository extends MongoRepository<OnboardingTask, String> {
    List<OnboardingTask> findByEmployeeId(String employeeId);
}

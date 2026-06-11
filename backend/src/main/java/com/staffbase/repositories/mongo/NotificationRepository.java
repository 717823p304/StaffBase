package com.staffbase.repositories.mongo;

import com.staffbase.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByEmployeeIdOrEmployeeIdIsNullOrderByTimestampDesc(String employeeId);
    List<Notification> findByEmployeeIdIsNullOrderByTimestampDesc();
}

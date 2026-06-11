package com.staffbase.repositories.mongo;

import com.staffbase.models.SystemSetting;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemSettingRepository extends MongoRepository<SystemSetting, String> {
}

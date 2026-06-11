package com.staffbase.repositories.mongo;

import com.staffbase.models.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SkillRepository extends MongoRepository<Skill, String> {
    Optional<Skill> findByName(String name);
}

package com.staffbase.repositories.jpa;

import com.staffbase.models.LoginAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoginAuditRepository extends JpaRepository<LoginAudit, Long> {
    List<LoginAudit> findAllByOrderByTimestampDesc();
}

package com.staffbase.repositories.mongo;

import com.staffbase.models.AnalyticsReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AnalyticsReportRepository extends MongoRepository<AnalyticsReport, String> {
    List<AnalyticsReport> findByReportType(String reportType);
}

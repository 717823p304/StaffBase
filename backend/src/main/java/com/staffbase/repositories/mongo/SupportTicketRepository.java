package com.staffbase.repositories.mongo;

import com.staffbase.models.SupportTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportTicketRepository extends MongoRepository<SupportTicket, String> {
    List<SupportTicket> findByEmployeeId(String employeeId);
}

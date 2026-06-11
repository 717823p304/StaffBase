package com.staffbase.repositories.mongo;

import com.staffbase.models.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface EmployeeRepository extends MongoRepository<Employee, String> {
    List<Employee> findByDepartment(String department);
    List<Employee> findByDesignation(String designation);
    
    @Query("{ '$or': [ { 'name': { '$regex': ?0, '$options': 'i' } }, { 'email': { '$regex': ?0, '$options': 'i' } }, { '_id': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Employee> searchEmployees(String term);
}

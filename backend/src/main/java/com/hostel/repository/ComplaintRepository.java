package com.hostel.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.hostel.model.Complaint;

import java.util.List;

public interface ComplaintRepository extends MongoRepository<Complaint,String> {

    List<Complaint> findByStudentId(String studentId);
}
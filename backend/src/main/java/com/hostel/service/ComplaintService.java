package com.hostel.service;

import com.hostel.model.Complaint;
import com.hostel.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository repo;

    // Create complaint
    public Complaint create(Complaint complaint) {

        complaint.setStatus("OPEN");
        complaint.setCreatedAt(LocalDateTime.now());

        return repo.save(complaint);
    }

    // Get all complaints (Admin)
    public List<Complaint> getAll() {
        return repo.findAll();
    }

    // Get complaints by student
    public List<Complaint> getStudentComplaints(String studentId) {
        return repo.findByStudentId(studentId);
    }

    // Update complaint status (Admin)
    public Complaint updateStatus(String id, String status) {

        Complaint complaint = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);

        return repo.save(complaint);
    }

    public Complaint updateRemark(String id, String remark) {

        Complaint complaint = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setAdminRemark(remark);

        return repo.save(complaint);
    }
}
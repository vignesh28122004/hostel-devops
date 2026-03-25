package com.hostel.controller;

import com.hostel.model.Complaint;
import com.hostel.model.User;
import com.hostel.repository.UserRepository;
import com.hostel.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor

public class ComplaintController {

    private final ComplaintService service;
    private final UserRepository userRepository;

    // ✅ STUDENT ONLY
    @PostMapping
    public Complaint create(
            @RequestBody Complaint complaint,
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        complaint.setStudentId(user.getId());

        return service.create(complaint);
    }

    // ✅ ADMIN ONLY
    @GetMapping
    public List<Complaint> getAll() {
        return service.getAll();
    }

    // ✅ STUDENT ONLY
    @GetMapping("/student/{id}")
    public List<Complaint> getStudentComplaints(@PathVariable String id) {
        return service.getStudentComplaints(id);
    }

    // ✅ ADMIN ONLY
    @PutMapping("/{id}")
    public Complaint updateStatus(@PathVariable String id,
                                  @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    // ✅ ADMIN ONLY
    @PutMapping("/{id}/remark")
    public Complaint updateRemark(@PathVariable String id,
                                  @RequestParam String remark) {
        return service.updateRemark(id, remark);
    }

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {

        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path path = Paths.get("uploads/" + fileName);

            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            return "http://localhost:8081/uploads/" + fileName;

        } catch (Exception e) {
            throw new RuntimeException("File upload failed");
        }
    }
}
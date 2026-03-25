package com.hostel.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection="complaints")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Complaint {

    @Id
    private String id;

    private String studentId;

    private String category;

    private String description;

    private String status;

    private String adminRemark;

    private LocalDateTime createdAt;

    private String imageUrl;
}
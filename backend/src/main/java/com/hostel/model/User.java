package com.hostel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;

    private String name;
    
    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String roomNumber;

    private String hostelBlock;

    private String role;

    private String refreshToken;
}
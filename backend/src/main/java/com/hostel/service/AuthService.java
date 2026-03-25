package com.hostel.service;

import com.hostel.dto.LoginRequest;
import com.hostel.dto.RegisterRequest;
import com.hostel.model.User;
import com.hostel.repository.UserRepository;
import com.hostel.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;


    public User register(RegisterRequest request) {

        // ✅ CHECK IF EMAIL EXISTS
        if (repo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // ✅ HASH PASSWORD
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRoomNumber(request.getRoomNumber());
        user.setHostelBlock(request.getHostelBlock());
        user.setRole("STUDENT");

        return repo.save(user);
    }

    public Map<String, Object> login(LoginRequest request) {

        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        // 🔥 SAVE IN DB
        user.setRefreshToken(refreshToken);
        repo.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("user", user);

        return response;
    }
}
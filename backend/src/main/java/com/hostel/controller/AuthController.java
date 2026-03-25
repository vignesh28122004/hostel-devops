package com.hostel.controller;

import com.hostel.dto.LoginRequest;
import com.hostel.dto.RegisterRequest;
import com.hostel.model.User;
import com.hostel.repository.UserRepository;
import com.hostel.security.JwtUtil;
import com.hostel.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository; // 🔥 ADD THIS

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(user);
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        Map<String, Object> response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // 🔐 SECURE REFRESH
    @PostMapping("/refresh")
    public Map<String, String> refresh(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        String newAccessToken = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        Map<String, String> response = new HashMap<>();
        response.put("token", newAccessToken);

        return response;
    }

    // 🔥 LOGOUT API
    @PostMapping("/logout")
    public String logout(@RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRefreshToken(null);
        userRepository.save(user);

        return "Logged out successfully";
    }
}
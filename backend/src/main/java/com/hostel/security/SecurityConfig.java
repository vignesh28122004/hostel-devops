package com.hostel.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // ✅ ADD
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity // 🔥 VERY IMPORTANT
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // ✅ PASSWORD ENCODER
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ SECURITY CONFIG
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // 🔥 DISABLE DEFAULT BASIC AUTH
                .httpBasic(httpBasic -> httpBasic.disable())

                // 🔥 STATELESS SESSION (JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // ✅ PUBLIC APIs
                        .requestMatchers("/api/auth/**").permitAll()

                        // ✅ FILE ACCESS
                        .requestMatchers("/uploads/**").permitAll()

                        // ✅ STUDENT → CREATE complaint
                        .requestMatchers(HttpMethod.POST, "/api/complaints")
                        .hasRole("STUDENT")

                        // ✅ ADMIN → VIEW ALL complaints
                        .requestMatchers(HttpMethod.GET, "/api/complaints")
                        .hasRole("ADMIN")

                        // ✅ STUDENT → THEIR complaints
                        .requestMatchers("/api/complaints/student/**")
                        .hasRole("STUDENT")

                        // ✅ ADMIN → UPDATE
                        .requestMatchers(HttpMethod.PUT, "/api/complaints/**")
                        .hasRole("ADMIN")

                        // ✅ ANY OTHER
                        .anyRequest().authenticated()
                )

                // 🔥 ADD JWT FILTER
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ CORS CONFIG
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:8080"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
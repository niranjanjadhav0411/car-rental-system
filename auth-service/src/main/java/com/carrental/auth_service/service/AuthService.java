package com.carrental.auth_service.service;

import com.carrental.auth_service.dto.AuthResponse;
import com.carrental.auth_service.dto.LoginRequest;
import com.carrental.auth_service.dto.RegisterRequest;
import com.carrental.auth_service.entity.Role;
import com.carrental.auth_service.entity.User;
import com.carrental.auth_service.repository.UserRepository;
import com.carrental.auth_service.security.JwtService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ================= REGISTER =================
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER); // ✅ MUST WORK (fix in User entity)

        userRepository.save(user);

        return "User registered successfully";
    }

    // ================= LOGIN =================
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.getRole() == null) {
            throw new RuntimeException("User role not assigned");
        }

        // ✅ IMPORTANT: authorities WITHOUT extra ROLE_
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().name()) // ROLE_USER / ROLE_ADMIN
                .build();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }

    // ================= CREATE DEFAULT ADMIN =================
    public void createAdminIfNotExists() {

        Optional<User> adminOpt =
                userRepository.findByEmail("admin@carrental.com");

        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@carrental.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);

            userRepository.save(admin);
        }
    }
}

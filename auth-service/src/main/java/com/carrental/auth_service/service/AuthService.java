package com.carrental.auth_service.service;

import com.carrental.auth_service.dto.AuthResponse;
import com.carrental.auth_service.dto.LoginRequest;
import com.carrental.auth_service.dto.RegisterRequest;
import com.carrental.auth_service.entity.Role;
import com.carrental.auth_service.entity.User;
import com.carrental.auth_service.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.carrental.auth_service.security.JwtService;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);

        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.getRole() == null) {
            throw new RuntimeException("User role not assigned. Please contact admin.");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().name())
                .build();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }

    public void createAdminIfNotExists() {

        Optional<User> adminOpt = userRepository.findByEmail("admin@carrental.com");

        if (adminOpt.isEmpty()) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@carrental.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .build();

            userRepository.save(admin);
        }
    }
}

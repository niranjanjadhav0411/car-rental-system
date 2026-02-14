package com.carrental.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('USER')")
public class UserController {

    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> profile(Authentication authentication) {

        return ResponseEntity.ok(
                Map.of(
                        "email", authentication.getName(),
                        "message", "User profile fetched successfully"
                )
        );
    }
}

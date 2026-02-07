package com.it342.g1.backend.controller;

import com.it342.g1.backend.entity.User;
import com.it342.g1.backend.repository.UserRepository;
import com.it342.g1.backend.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TokenProvider tokenProvider;
    
    // Get user profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            
            if (!tokenProvider.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }
            
            String username = tokenProvider.getUsernameFromToken(token);
            Optional<User> userOptional = userRepository.findByUsername(username);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            
            User user = userOptional.get();
            
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getUserId());
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("createdAt", user.getCreatedAt());
            profile.put("lastLogin", user.getLastLogin());
            profile.put("isActive", user.getIsActive());
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> updates) {
        try {
            String token = authHeader.replace("Bearer ", "");
            
            if (!tokenProvider.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }
            
            String username = tokenProvider.getUsernameFromToken(token);
            Optional<User> userOptional = userRepository.findByUsername(username);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            
            User user = userOptional.get();
            
            // Update allowed fields
            if (updates.containsKey("email")) {
                user.setEmail(updates.get("email"));
            }
            
            userRepository.save(user);
            
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getUserId());
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("message", "Profile updated successfully");
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

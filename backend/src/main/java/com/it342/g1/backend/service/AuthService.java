package com.it342.g1.backend.service;

import com.it342.g1.backend.entity.User;
import com.it342.g1.backend.repository.UserRepository;
import com.it342.g1.backend.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TokenProvider tokenProvider;
    
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{3,20}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
    
    // Register user
    public String registerUser(String username, String email, String password) {
        // Validate username
        if (!USERNAME_PATTERN.matcher(username).matches()) {
            throw new IllegalArgumentException("Username must be 3-20 characters, alphanumeric and underscore only");
        }
        
        // Validate email
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        // Check username uniqueness
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Check email uniqueness
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Validate password strength
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException(
                "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
            );
        }
        
        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Hash password
        user.setIsActive(true);
        user.setFailedLoginAttempts(0);
        
        // Save user
        userRepository.save(user);
        
        return "User registered successfully";
    }
    
    // Login user
    public AuthResponse loginUser(String identifier, String password) {
        // Find user by username or email
        Optional<User> userOptional = userRepository.findByUsername(identifier);
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByEmail(identifier);
        }
        
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        User user = userOptional.get();
        
        // Check if account is locked
        if (user.getAccountLockedUntil() != null && 
            user.getAccountLockedUntil().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Account is locked. Try again later.");
        }
        
        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            // Increment failed attempts
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            
            // Lock account after 5 failed attempts
            if (user.getFailedLoginAttempts() >= 5) {
                user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(15));
                userRepository.save(user);
                throw new IllegalArgumentException("Account locked due to multiple failed attempts");
            }
            
            userRepository.save(user);
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        // Reset failed attempts on successful login
        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate JWT token
        String token = tokenProvider.generateToken(user.getUsername(), user.getUserId());
        
        // Return token and user info
        return new AuthResponse(token, user.getUsername(), user.getEmail());
    }
    
    // Logout user (can be extended with token blacklist)
    public String logoutUser(String token) {
        if (!tokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Invalid token");
        }
        // In a production app, add token to blacklist here
        return "Logged out successfully";
    }
    
    // Inner class for login response
    public static class AuthResponse {
        private String token;
        private String username;
        private String email;
        
        public AuthResponse(String token, String username, String email) {
            this.token = token;
            this.username = username;
            this.email = email;
        }
        
        // Getters
        public String getToken() { return token; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
    }
}
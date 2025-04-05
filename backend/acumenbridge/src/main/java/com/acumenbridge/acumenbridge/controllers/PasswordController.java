package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import com.acumenbridge.acumenbridge.services.EmailService;
import com.acumenbridge.acumenbridge.services.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetService passwordResetService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Endpoint to request a password reset link
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody EmailRequest request) {
        String email = request.getEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Email not found");
        }
        // Generate a reset token
        String token = passwordResetService.createResetToken(email);
        // Construct the reset link (adjust this URL to point to your React reset password page)
        String resetLink = "http://localhost:5173/reset-password/" + token + "?email=" + email;
        // Send the reset link via email
        emailService.sendPasswordResetEmail(email, resetLink);
        return ResponseEntity.ok("Password reset link sent to your email");
    }

    // Endpoint to reset the password using the provided token and new password.
    // Note: We now extract all data from the request body instead of the SecurityContext.
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String email = request.getEmail();
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        // Validate that none of the required fields are missing.
        if (email == null || token == null || newPassword == null ||
            email.isEmpty() || token.isEmpty() || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Email, token, and new password are required");
        }

        // Validate the token
        if (!passwordResetService.validateResetToken(email, token)) {
            return ResponseEntity.badRequest().body("Invalid or expired reset token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();
        // Update user's password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        // Remove the used reset token
        passwordResetService.removeResetToken(email);
        return ResponseEntity.ok("Password has been reset successfully");
    }
}

// Helper request classes (you can put these in separate files if you prefer)


class ResetPasswordRequest {
    private String email;
    private String token;
    private String newPassword;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
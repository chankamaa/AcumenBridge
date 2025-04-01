package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import com.acumenbridge.acumenbridge.services.EmailService;
import com.acumenbridge.acumenbridge.services.OTPService;
import com.acumenbridge.acumenbridge.services.JwtService;
import com.acumenbridge.acumenbridge.utils.OTPUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OTPService otpService;

    @Autowired
    private JwtService jwtService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // Login endpoint with JWT token generation
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        var userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid credentials.");
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid credentials.");
        }
        // Generate JWT token
        String token = jwtService.generateToken(user);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful!");
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    // OTP sending endpoint
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody EmailRequest emailRequest) {
        String email = emailRequest.getEmail();
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }
        // Generate OTP
        String otp = OTPUtil.generateOTP();
        // Store OTP temporarily
        otpService.storeOTP(email, otp);
        // Send OTP via email
        emailService.sendOtpEmail(email, otp);
        return ResponseEntity.ok("OTP sent to your email.");
    }

    // OTP verification endpoint
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpVerificationRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        if (otpService.validateOTP(email, otp)) {
            otpService.removeOTP(email);
            return ResponseEntity.ok("Email verified successfully.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }
    }
}

// Helper classes for request bodies:
class EmailRequest {
    private String email;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

class OtpVerificationRequest {
    private String email;
    private String otp;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
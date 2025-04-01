package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;

        if (principal instanceof Jwt) {
            // Custom login: extract email from JWT's subject
            email = ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            // Social login: extract email from OAuth2 attributes
            email = (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            // Fallback for other cases
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        System.out.println("Extracted email: " + email);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
    }
}
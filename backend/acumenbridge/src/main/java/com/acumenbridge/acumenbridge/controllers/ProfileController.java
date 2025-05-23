package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping(value = "/auth", produces = "application/json")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Endpoint for current user's profile (requires authentication)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;

        if (principal instanceof Jwt) {
            email = ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            email = (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        System.out.println("Extracted email: " + email);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            // For social logins without full profile data, create a new user record.
            if (principal instanceof DefaultOAuth2User) {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(email); // Default name; prompt user to update later
                newUser = userRepository.save(newUser);
                return ResponseEntity.ok(newUser);
            } else {
                return ResponseEntity.badRequest().body("User not found");
            }
        }
    }

    // New endpoint to fetch any user's profile by ID (publicly viewable)
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable("id") String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    // Endpoint to update the profile for the logged-in user
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam("name") String name,
            @RequestParam(value = "oldPassword", required = false) String oldPassword,
            @RequestParam(value = "newPassword", required = false) String newPassword,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "banner", required = false) MultipartFile banner) {

        // Retrieve authenticated user's email
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;
        if (principal instanceof Jwt) {
            email = ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            email = (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        user.setName(name);

        // If a new password is provided, verify the old password first
        if (newPassword != null && !newPassword.isEmpty()) {
            if (oldPassword == null || oldPassword.isEmpty() || !passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("Old password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        // Handle avatar file upload
        if (avatar != null && !avatar.isEmpty()) {
            try {
                String avatarFileName = "avatar_" + user.getId() + "_" + avatar.getOriginalFilename();
                Path avatarPath = Paths.get("uploads/avatars/" + avatarFileName);
                Files.createDirectories(avatarPath.getParent());
                Files.write(avatarPath, avatar.getBytes());
                // Update user's avatar URL (adjust the URL based on your hosting configuration)
                user.setAvatar("http://localhost:8080/uploads/avatars/" + avatarFileName);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving avatar");
            }
        }

        // Handle banner file upload
        if (banner != null && !banner.isEmpty()) {
            try {
                String bannerFileName = "banner_" + user.getId() + "_" + banner.getOriginalFilename();
                Path bannerPath = Paths.get("uploads/banners/" + bannerFileName);
                Files.createDirectories(bannerPath.getParent());
                Files.write(bannerPath, banner.getBytes());
                user.setBanner("http://localhost:8080/uploads/banners/" + bannerFileName);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving banner");
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/delete-profile")
public ResponseEntity<?> deleteProfile() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    String email = null;

    if (principal instanceof Jwt) {
        email = ((Jwt) principal).getSubject();
    } else if (principal instanceof DefaultOAuth2User) {
        email = (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
    } else if (principal instanceof UserDetails) {
        email = ((UserDetails) principal).getUsername();
    } else {
        email = principal.toString();
    }

    Optional<User> userOpt = userRepository.findByEmail(email);
    if (!userOpt.isPresent()) {
        return ResponseEntity.badRequest().body("User not found");
    }

    userRepository.delete(userOpt.get());
    return ResponseEntity.ok("User profile deleted successfully");
}
}
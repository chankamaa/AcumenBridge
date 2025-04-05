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

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ConnectionController {

    @Autowired
    private UserRepository userRepository;

    // Helper method to extract the email of the logged in user
    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            return (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }

    // Endpoint to follow a user
    @PostMapping("/follow/{targetUserId}")
    public ResponseEntity<?> followUser(@PathVariable String targetUserId) {
        String email = getLoggedInUserEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);
        Optional<User> optionalTarget = userRepository.findById(targetUserId);

        if (!optionalUser.isPresent() || !optionalTarget.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User currentUser = optionalUser.get();
        User targetUser = optionalTarget.get();

        // Add targetUser's ID to currentUser's following list (if not already present)
        if (!currentUser.getFollowing().contains(targetUserId)) {
            currentUser.getFollowing().add(targetUserId);
        }
        // Add currentUser's ID to targetUser's followers list (if not already present)
        if (!targetUser.getFollowers().contains(currentUser.getId())) {
            targetUser.getFollowers().add(currentUser.getId());
        }

        userRepository.save(currentUser);
        userRepository.save(targetUser);

        return ResponseEntity.ok("Now following user: " + targetUser.getName());
    }

    // Endpoint to unfollow a user
    @PostMapping("/unfollow/{targetUserId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String targetUserId) {
        String email = getLoggedInUserEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);
        Optional<User> optionalTarget = userRepository.findById(targetUserId);

        if (!optionalUser.isPresent() || !optionalTarget.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User currentUser = optionalUser.get();
        User targetUser = optionalTarget.get();

        currentUser.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(currentUser.getId());

        userRepository.save(currentUser);
        userRepository.save(targetUser);

        return ResponseEntity.ok("Unfollowed user: " + targetUser.getName());
    }

    // Endpoint to list connections for the logged in user
    @GetMapping("/connections")
    public ResponseEntity<?> getConnections() {
        String email = getLoggedInUserEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (!optionalUser.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User currentUser = optionalUser.get();
        // For example, return both lists; you can customize the response as needed.
        return ResponseEntity.ok(new ConnectionsResponse(currentUser.getFollowers(), currentUser.getFollowing()));
    }

    // Helper response class for connections
    static class ConnectionsResponse {
        private List<String> followers;
        private List<String> following;

        public ConnectionsResponse(List<String> followers, List<String> following) {
            this.followers = followers;
            this.following = following;
        }

        public List<String> getFollowers() {
            return followers;
        }

        public void setFollowers(List<String> followers) {
            this.followers = followers;
        }

        public List<String> getFollowing() {
            return following;
        }

        public void setFollowing(List<String> following) {
            this.following = following;
        }
    }
}
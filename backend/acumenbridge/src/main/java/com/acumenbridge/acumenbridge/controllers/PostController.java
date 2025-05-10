package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.Post;
import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.PostRepository;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // --- Helper to extract the current user's email from the security context ---
    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext()
                                                .getAuthentication()
                                                .getPrincipal();

        if (principal instanceof Jwt) {
            return ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            return (String) ((DefaultOAuth2User) principal)
                                 .getAttributes()
                                 .get("email");
        } else if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    // --- Helper to load the current User entity ---
    private Optional<User> getCurrentUser() {
        String email = getLoggedInUserEmail();
        return userRepository.findByEmail(email);
    }

    /**
     * POST /posts
     * Create a new post by the logged-in user.
     */
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User currentUser = optUser.get();

        Instant now = Instant.now();
        post.setUserId(currentUser.getId());
        post.setUserName(currentUser.getName());
        post.setCreatedAt(now);
        post.setUpdatedAt(now);

        Post saved = postRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    /**
     * GET /posts
     * Return a feed: all posts by the current user and those they follow, newest first.
     */
    @GetMapping
    public ResponseEntity<?> getFeed() {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User currentUser = optUser.get();

        // build list of IDs: themselves + whoever they follow
        List<String> userIds = new ArrayList<>(currentUser.getFollowing());
        userIds.add(currentUser.getId());

        List<Post> feed = postRepository.findByUserIdInOrderByCreatedAtDesc(userIds);
        return ResponseEntity.ok(feed);
    }

    /**
     * GET /posts/user/{userId}
     * Return all posts by a given user (for profile pages), newest first.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUser(@PathVariable String userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(posts);
    }

    /**
     * GET /posts/{id}
     * Return a single post by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        Optional<Post> opt = postRepository.findById(id);
        return opt.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * PUT /posts/{id}
     * Update a post’s description and mediaUrls. Only the owner may update.
     */
    

    /**
     * DELETE /posts/{id}
     * Delete a post. Only the owner may delete.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String currentUserId = optUser.get().getId();

        Optional<Post> optPost = postRepository.findById(id);
        if (!optPost.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Post existing = optPost.get();
        if (!existing.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

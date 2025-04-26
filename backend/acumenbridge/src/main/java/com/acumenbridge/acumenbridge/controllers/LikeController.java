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

import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/posts/{postId}/likes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LikeController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // --- same helper from PostController ---
    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            return (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return null;
    }

    private Optional<User> getCurrentUser() {
        String email = getLoggedInUserEmail();
        return userRepository.findByEmail(email);
    }

    /** Like a post */
    @PostMapping
    public ResponseEntity<?> like(@PathVariable String postId) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Post> opt = postRepository.findById(postId);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();

        Post post = opt.get();
        String uid = optUser.get().getId();

        Set<String> likes = post.getLikes();
        if (!likes.contains(uid)) {
            likes.add(uid);
            post.setLikes(likes);
            postRepository.save(post);
        }
        return ResponseEntity.ok(likes);
    }

    /** Unlike a post */
    @DeleteMapping
    public ResponseEntity<?> unlike(@PathVariable String postId) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Post> opt = postRepository.findById(postId);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();

        Post post = opt.get();
        String uid = optUser.get().getId();

        Set<String> likes = post.getLikes();
        if (likes.contains(uid)) {
            likes.remove(uid);
            post.setLikes(likes);
            postRepository.save(post);
        }
        return ResponseEntity.ok(likes);
    }

    /** List who has liked */
    @GetMapping
    public ResponseEntity<?> listLikes(@PathVariable String postId) {
        Optional<Post> opt = postRepository.findById(postId);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(opt.get().getLikes());
    }
}

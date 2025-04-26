package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.Comment;
import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.CommentRepository;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CommentController {

    @Autowired private CommentRepository commentRepo;
    @Autowired private UserRepository    userRepo;

    // helper to get logged-in user email
    private String getLoggedInEmail() {
        Object p = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (p instanceof Jwt)               return ((Jwt)p).getSubject();
        else if (p instanceof DefaultOAuth2User) return (String)((DefaultOAuth2User)p).getAttributes().get("email");
        else if (p instanceof UserDetails)   return ((UserDetails)p).getUsername();
        else                                 return null;
    }

    private Optional<User> getCurrentUser() {
        String email = getLoggedInEmail();
        return email == null ? Optional.empty() : userRepo.findByEmail(email);
    }

    /** create a comment under a post */
    @PostMapping("/post/{postId}")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody Comment incoming
    ) {
        Optional<User> u = getCurrentUser();
        if (u.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
        Comment c = new Comment();
        c.setPostId(postId);
        c.setAuthorId(u.get().getId());
        c.setAuthorName(u.get().getName());
        c.setText(incoming.getText());
        Instant now = Instant.now();
        c.setCreatedAt(now);
        c.setUpdatedAt(now);
        Comment saved = commentRepo.save(c);
        return ResponseEntity.ok(saved);
    }

    /** list all comments for a post */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> listByPost(@PathVariable String postId) {
        return ResponseEntity.ok(
            commentRepo.findByPostIdOrderByCreatedAtAsc(postId)
        );
    }

    /** edit your own comment */
    @PutMapping("/{id}")
    public ResponseEntity<?> editComment(
            @PathVariable String id,
            @RequestBody Comment updates
    ) {
        Optional<User> u = getCurrentUser();
        if (u.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Comment> oc = commentRepo.findById(id);
        if (oc.isEmpty()) return ResponseEntity.notFound().build();

        Comment existing = oc.get();
        if (!existing.getAuthorId().equals(u.get().getId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        existing.setText(updates.getText());
        existing.setUpdatedAt(Instant.now());
        return ResponseEntity.ok(commentRepo.save(existing));
    }

    /** delete your own comment (or post‐owner?) */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        Optional<User> u = getCurrentUser();
        if (u.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Comment> oc = commentRepo.findById(id);
        if (oc.isEmpty()) return ResponseEntity.notFound().build();
        Comment existing = oc.get();

        boolean isAuthor = existing.getAuthorId().equals(u.get().getId());
        boolean isPostOwner = false;
        // if you also want post‐owners to delete any comment, you can load the Post and compare userId

        if (!isAuthor && !isPostOwner) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        commentRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

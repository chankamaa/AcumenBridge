// controllers/ProgressController.java

package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.Progress;
import com.acumenbridge.acumenbridge.repositories.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProgressController {

    @Autowired
    private ProgressRepository progressRepository;

    @PostMapping
    public ResponseEntity<Progress> createProgress(
            @RequestBody Progress progress,
            @AuthenticationPrincipal Jwt jwt) {
        progress.setUserId(jwt.getSubject());
        progress.setCreatedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());
        if (progress.getTemplate() == null) {
            progress.setTemplate("default");
        }
        return ResponseEntity.ok(progressRepository.save(progress));
    }

    @GetMapping
    public ResponseEntity<List<Progress>> getAllProgress(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(progressRepository.findByUserId(jwt.getSubject()));
    }

    @GetMapping("/public")
    public ResponseEntity<List<Progress>> getAllPublicProgress() {
        return ResponseEntity.ok(progressRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Progress> getProgressById(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        Optional<Progress> progress = progressRepository.findByIdAndUserId(id, jwt.getSubject());
        return progress.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Progress> updateProgress(
            @PathVariable String id,
            @RequestBody Progress updatedProgress,
            @AuthenticationPrincipal Jwt jwt) {
        Optional<Progress> existingProgress = progressRepository.findByIdAndUserId(id, jwt.getSubject());
        if (existingProgress.isPresent()) {
            Progress progress = existingProgress.get();
            progress.setAchievementType(updatedProgress.getAchievementType());
            progress.setHead(updatedProgress.getHead());
            progress.setDescription(updatedProgress.getDescription());
            progress.setCompleted(updatedProgress.getCompleted());
            progress.setToComplete(updatedProgress.getToComplete());
            progress.setTemplate(updatedProgress.getTemplate()); // Add this line
            progress.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(progressRepository.save(progress));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<Progress> toggleLike(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        Optional<Progress> progressOpt = progressRepository.findById(id);
        if (progressOpt.isPresent()) {
            Progress progress = progressOpt.get();
            String userId = jwt.getSubject();
            
            if (progress.getLikedBy().contains(userId)) {
                // Unlike
                progress.getLikedBy().remove(userId);
                progress.setLikes(progress.getLikes() - 1);
            } else {
                // Like
                progress.getLikedBy().add(userId);
                progress.setLikes(progress.getLikes() + 1);
            }
            
            progress.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(progressRepository.save(progress));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        Optional<Progress> progress = progressRepository.findByIdAndUserId(id, jwt.getSubject());
        if (progress.isPresent()) {
            progressRepository.delete(progress.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
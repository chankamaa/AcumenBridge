package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.LearningPlan;
import com.acumenbridge.acumenbridge.repositories.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository repository;

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<LearningPlan> plans = repository.findByUserId(userId);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/public")
    public ResponseEntity<List<LearningPlan>> getAllPublicLearningPlans() {
        List<LearningPlan> plans = repository.findAll();
        // You might want to add filtering or join with user data here
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        LearningPlan plan = repository.findById(id).orElse(null);
        
        if (plan == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Learning plan not found");
        }
        
        if (!plan.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Not authorized to access this learning plan");
        }
        
        return ResponseEntity.ok(plan);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody LearningPlan plan,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userId = jwt.getSubject();
        
        plan.setUserId(userId);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());
        
        LearningPlan savedPlan = repository.save(plan);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestBody LearningPlan updatedPlan,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userId = jwt.getSubject();
        
        // Check if plan exists and belongs to user
        LearningPlan existingPlan = repository.findById(id).orElse(null);
        if (existingPlan == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Learning plan not found");
        }
        
        if (!existingPlan.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Not authorized to update this learning plan");
        }
        
        // Update fields
        updatedPlan.setId(id);
        updatedPlan.setUserId(userId);
        updatedPlan.setCreatedAt(existingPlan.getCreatedAt());
        updatedPlan.setUpdatedAt(LocalDateTime.now());
        
        LearningPlan savedPlan = repository.save(updatedPlan);
        return ResponseEntity.ok(savedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userId = jwt.getSubject();
        
        LearningPlan plan = repository.findById(id).orElse(null);
        if (plan == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Learning plan not found");
        }
        
        if (!plan.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Not authorized to delete this learning plan");
        }
        
        repository.deleteById(id);
        return ResponseEntity.ok("Successfully deleted Learning Plan with ID: " + id);
    }
}
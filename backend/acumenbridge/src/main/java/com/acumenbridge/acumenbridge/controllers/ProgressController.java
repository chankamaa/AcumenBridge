package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.Progress;
import com.acumenbridge.acumenbridge.repositories.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

public class ProgressController {

    @Autowired
    private ProgressRepository progressRepository;

    // Create
    @PostMapping
    public Progress createProgress(@RequestBody Progress progress) {
        return progressRepository.save(progress);
    }

    // Read all
    @GetMapping
    public List<Progress> getAllProgress() {
        return progressRepository.findAll();
    }

    // Read one
    @GetMapping("/{id}")
    public ResponseEntity<Progress> getProgressById(@PathVariable String id) {
        return progressRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Progress> updateProgress(@PathVariable String id, @RequestBody Progress updatedProgress) {
        return progressRepository.findById(id).map(progress -> {
            progress.setAchievementType(updatedProgress.getAchievementType());
            progress.setHead(updatedProgress.getHead());
            progress.setDescription(updatedProgress.getDescription());
            progress.setCompleted(updatedProgress.getCompleted());
            progress.setToComplete(updatedProgress.getToComplete());
            return ResponseEntity.ok(progressRepository.save(progress));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id) {
        return progressRepository.findById(id).map(progress -> {
            progressRepository.delete(progress);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}

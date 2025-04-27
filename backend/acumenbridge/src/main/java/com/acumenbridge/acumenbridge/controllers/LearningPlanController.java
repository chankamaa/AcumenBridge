package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.LearningPlan;
import com.acumenbridge.acumenbridge.repositories.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository repository;

    @GetMapping
    public List<LearningPlan> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public LearningPlan getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody LearningPlan plan) {
        LearningPlan savedPlan = repository.save(plan);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Learning plan created successfully with ID: " + savedPlan.getId());
    }

    @PutMapping("/{id}")
    public LearningPlan update(@PathVariable String id, @RequestBody LearningPlan updatedPlan) {
        updatedPlan.setId(id);
        return repository.save(updatedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok("Learning plan deleted successfully with ID: " + id);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Learning plan with ID " + id + " not found.");
        }
    }
}

package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SearchController {

    @Autowired
    private UserRepository userRepository;

    // GET /auth/search?q=yourQuery
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam("query") String query) {
        List<User> results = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
        return ResponseEntity.ok(results);
    }
}
// models/Progress.java

package com.acumenbridge.acumenbridge.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "progress")
public class Progress {
    @Id
    private String id;
    private String userId;
    private String achievementType;
    private String head;
    private String description;
    private int completed;
    private int toComplete;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String template;
    
    
    // In your Progress.java model
    private int likes = 0;
    private Set<String> likedBy = new HashSet<>(); // Track which users liked

    // Add getters and setters
    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public Set<String> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(Set<String> likedBy) {
        this.likedBy = likedBy;
    }
}
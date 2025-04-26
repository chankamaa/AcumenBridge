// src/main/java/com/acumenbridge/acumenbridge/models/Post.java
package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String userId;       // who created it
    private String userName;     // display name of the creator

    private String description;
    private List<String> mediaUrls = new ArrayList<>();

    private Set<String> likes = new HashSet<>();   // user IDs who have liked

    private Instant createdAt;
    private Instant updatedAt;

    public Post() {
        // Default constructor for Spring Data
    }

    /**
     * Convenience constructor for creating a new Post.
     *
     * @param userId      ID of the user creating the post
     * @param userName    Name of the user creating the post
     * @param description description text
     * @param mediaUrls   list of Cloudinary URLs
     */
    public Post(String userId, String userName, String description, List<String> mediaUrls) {
        this.userId      = userId;
        this.userName    = userName;
        this.description = description;
        this.mediaUrls   = mediaUrls != null ? mediaUrls : new ArrayList<>();
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    // --------------------------------------
    // Getters and setters
    // --------------------------------------

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }
    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public Set<String> getLikes() {
        return likes;
    }
    public void setLikes(Set<String> likes) {
        this.likes = likes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    // --------------------------------------
    // Convenience methods
    // --------------------------------------

    public void addLike(String userId) {
        this.likes.add(userId);
    }

    public void removeLike(String userId) {
        this.likes.remove(userId);
    }

    // --------------------------------------
    // toString, equals, hashCode (optional)
    // --------------------------------------

    @Override
    public String toString() {
        return "Post{" +
               "id='" + id + '\'' +
               ", userId='" + userId + '\'' +
               ", userName='" + userName + '\'' +
               ", description='" + description + '\'' +
               ", mediaUrls=" + mediaUrls +
               ", likes=" + likes +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}

// src/main/java/com/acumenbridge/acumenbridge/models/Comment.java
package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String postId;
    private String authorId;
    private String authorName;
    private String text;

    private Instant createdAt;
    private Instant updatedAt;

    public Comment() {
        // Default constructor for Spring Data
    }

    /**
     * Convenience constructor for creating a new Comment.
     *
     * @param postId      ID of the post being commented on
     * @param authorId    ID of the user making the comment
     * @param authorName  Display name of the commenter
     * @param text        The comment text
     */
    public Comment(String postId, String authorId, String authorName, String text) {
        this.postId     = postId;
        this.authorId   = authorId;
        this.authorName = authorName;
        this.text       = text;
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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

    @Override
    public String toString() {
        return "Comment{" +
               "id='" + id + '\'' +
               ", postId='" + postId + '\'' +
               ", authorId='" + authorId + '\'' +
               ", authorName='" + authorName + '\'' +
               ", text='" + text + '\'' +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}

package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "progress")
public class Progress {

    @Id
    private String id;

    private String achievementType;
    private String head;
    private String description;
    private int completed;
    private int toComplete;

    // Getters and Setters
    
    public String getId() {
        return id;
    }

    public String getAchievementType() {
        return achievementType;
    }

    public void setAchievementType(String achievementType) {
        this.achievementType = achievementType;
    }

    public String getHead() {
        return head;
    }

    public void setHead(String head) {
        this.head = head;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCompleted() {
        return completed;
    }

    public void setCompleted(int completed) {
        this.completed = completed;
    }

    public int getToComplete() {
        return toComplete;
    }

    public void setToComplete(int toComplete) {
        this.toComplete = toComplete;
    }
}

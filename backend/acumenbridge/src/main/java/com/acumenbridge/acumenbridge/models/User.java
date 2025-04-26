// src/main/java/com/acumenbridge/acumenbridge/models/User.java
package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password; // Hashed password
    private String avatar;   // URL or file path to user's avatar image
    private String banner;   // URL or file path to user's banner image

    // New fields for connections
    private List<String> following = new ArrayList<>();
    private List<String> followers = new ArrayList<>();

    public User() {}

    public User(String name, String email, String password, String avatar, String banner) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.banner = banner;
    }

    // Getters and setters for existing fields...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getBanner() { return banner; }
    public void setBanner(String banner) { this.banner = banner; }

    // Getters and setters for new fields
    public List<String> getFollowing() { return following; }
    public void setFollowing(List<String> following) { this.following = following; }
    public List<String> getFollowers() { return followers; }
    public void setFollowers(List<String> followers) { this.followers = followers; }
}
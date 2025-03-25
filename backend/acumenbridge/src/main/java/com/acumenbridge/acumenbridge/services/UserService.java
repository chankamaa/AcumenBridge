package com.acumenbridge.acumenbridge.services;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    public String getWelcomeMessage(String username) {
        return "Welcome, " + username + "!";
    }
}
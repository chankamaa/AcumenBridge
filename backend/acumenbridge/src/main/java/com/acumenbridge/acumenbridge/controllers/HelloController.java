package com.acumenbridge.acumenbridge.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.acumenbridge.acumenbridge.services.UserService;

@RestController
public class HelloController {

    private final UserService userService;

    public HelloController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from Acumenbridge!";
    }

    @GetMapping("/greet/{name}")
    public String greetUser(@PathVariable String name) {
        return userService.getWelcomeMessage(name);
    }
}
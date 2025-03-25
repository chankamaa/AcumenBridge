package com.acumenbridge.acumenbridge.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class CustomLoginController {

    @GetMapping("/my-custom-login")
    public RedirectView redirectToReactLogin() {
        // This is the URL of your React login route
        return new RedirectView("http://localhost:5173/login");
    }
}
package com.acumenbridge.acumenbridge.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for stateless REST APIs
            .csrf(csrf -> csrf.disable())

            // Authorize requests
            .authorizeHttpRequests(auth -> auth
                // Permit manual auth endpoints (e.g., /auth/register, /auth/login)
                .requestMatchers("/auth/**").permitAll()
                // Permit OAuth2 endpoints (e.g., /oauth2/authorization/google, etc.)
                .requestMatchers("/oauth2/**").permitAll()
                // Permit your custom login page (GET /my-custom-login)
                .requestMatchers("/my-custom-login").permitAll()
                // Permit static resources
                .requestMatchers("/", "/css/**", "/js/**", "/images/**").permitAll()
                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            // Disable default form login so that our custom login is used
            .formLogin(form -> form.disable())
            // Configure OAuth2 login to use our custom login page and set a success handler
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/my-custom-login")
                .successHandler((request, response, authentication) -> {
                    // Redirect to your React home page after successful login
                    response.sendRedirect("http://localhost:5173/home");
                })
                .permitAll()
            )
            // Allow logout for everyone
            .logout(logout -> logout.permitAll());

        return http.build();
    }
}
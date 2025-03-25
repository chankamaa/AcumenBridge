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
                // Permit all to these endpoints
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/", "/css/**", "/js/**", "/images/**").permitAll()
                .anyRequest().authenticated()
            )
            // Disable default form login
            .formLogin(form -> form.disable())

            // If using OAuth2, define custom login page or skip
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/my-custom-login")
                .permitAll()
            )
            .logout(logout -> logout.permitAll());

        return http.build();
    }
}
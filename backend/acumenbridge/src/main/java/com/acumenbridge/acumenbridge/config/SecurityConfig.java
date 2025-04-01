package com.acumenbridge.acumenbridge.config;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import io.jsonwebtoken.security.Keys;

@Configuration
public class SecurityConfig {

    // This secret should match the one used in your JwtService for generating tokens
    private final String secretKey = "mySuperSecretKeyThatShouldBeLongEnoughForHS256";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource()).and()
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/oauth2/**", "/my-custom-login", "/", "/css/**", "/js/**", "/images/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/my-custom-login")
                .permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/my-custom-login")
                .successHandler((request, response, authentication) -> {
                    // For social login, the session should be established.
                    response.sendRedirect("http://localhost:5173/home");
                })
                .permitAll()
            )
            // Enable resource server support for JWT-based authentication (custom login)
            .oauth2ResourceServer(oauth2 -> oauth2.jwt())
            .logout(logout -> logout.permitAll());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(
            Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8))
        ).build();
    }
}
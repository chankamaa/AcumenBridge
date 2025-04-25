package com.acumenbridge.acumenbridge.config;

import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
public class SecurityConfig {

    // This secret should match the one used in your JwtService for generating tokens
    private final String secretKey = "mySuperSecretKeyThatShouldBeLongEnoughForHS256";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // Return 401 (Unauthorized) for API calls instead of redirecting
            .exceptionHandling(exception ->
                exception.authenticationEntryPoint((request, response, authException) ->
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                )
            )
            .authorizeHttpRequests(auth -> auth
                // Public endpoints for registration, OTP, login, etc.
                .requestMatchers("/auth/register", "/auth/send-otp", "/auth/verify-otp", "/auth/login",
                                  "/auth/forgot-password", "/auth/reset-password", "/auth/reset-password/**", "/oauth2/**", "/my-custom-login",
                                  "/", "/css/**", "/js/**", "/images/**", "/uploads/**","/connections", "/connections/**").permitAll()
                // Secure endpoints that require authentication
                .requestMatchers("/auth/profile", "/auth/update-profile", "/auth/following", "/auth/suggestions",
                                  "/auth/follow/**", "/auth/unfollow/**","/auth/profile/**").authenticated()

                .requestMatchers("/posts/**").permitAll()

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/my-custom-login")
                .permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/my-custom-login")
                .successHandler((request, response, authentication) -> {
                    response.sendRedirect("http://localhost:5173/");
                })
                .permitAll()
            )
            // Removed OAuth2 resource server configuration to allow session-based authentication for social logins
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
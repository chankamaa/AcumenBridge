package com.acumenbridge.acumenbridge.config;

import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

    private final String secretKey = "mySuperSecretKeyThatShouldBeLongEnoughForHS256";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, ex2) ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                )
            )
            .authorizeHttpRequests(auth -> auth

                // public auth endpoints
                .requestMatchers(
                    "/auth/register",
                    "/auth/send-otp",
                    "/auth/verify-otp",
                    "/auth/login",
                    "/auth/forgot-password",
                    "/auth/reset-password",
                    "/auth/reset-password/**",
                    "/oauth2/**",
                    "/my-custom-login",
                    "/", "/css/**", "/js/**", "/images/**", "/uploads/**",
                    "/connections", "/connections/**"
                ).permitAll()

                // profile & follow/suggestions require auth
                .requestMatchers(
                    "/auth/profile",
                    "/auth/update-profile",
                    "/auth/following",
                    "/auth/suggestions",
                    "/auth/follow/**",
                    "/auth/unfollow/**",
                    "/auth/profile/**"
                ).authenticated()

                // POSTS: anyone can GET, but mutating operations need auth
                .requestMatchers(HttpMethod.GET,    "/posts/**").permitAll()
                .requestMatchers(HttpMethod.POST,   "/posts").authenticated()
                .requestMatchers(HttpMethod.PUT,    "/posts/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/posts/**").authenticated()

                // LIKES: require auth
                .requestMatchers(HttpMethod.POST, "/posts/*/like").authenticated()
                .requestMatchers(HttpMethod.POST, "/posts/*/unlike").authenticated()

                // COMMENTS: GET is public, others require auth
                .requestMatchers(HttpMethod.GET,    "/comments/post/**").permitAll()
                .requestMatchers(HttpMethod.POST,   "/comments/post/**").authenticated()
                .requestMatchers(HttpMethod.PUT,    "/comments/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/comments/**").authenticated()

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/my-custom-login")
                .permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/my-custom-login")
                .successHandler((req, res, auth) -> res.sendRedirect("http://localhost:5173/"))
                .permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt())
            .logout(logout -> logout.permitAll());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        cfg.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(Arrays.asList("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder
            .withSecretKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
            .build();
    }
}

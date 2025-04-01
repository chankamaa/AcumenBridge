package com.acumenbridge.acumenbridge.services;

import com.acumenbridge.acumenbridge.models.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    // In production, store your secret securely (e.g., environment variable)
    private final String secretKey = "mySuperSecretKeyThatShouldBeLongEnoughForHS256"; 
    // Token validity period (24 hours)
    private final long expirationMillis = 86400000;

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("name", user.getName())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }
}
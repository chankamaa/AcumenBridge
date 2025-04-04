package com.acumenbridge.acumenbridge.services;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    /**
     * Simple container to hold the token and its expiry time.
     */
    private static class ResetTokenInfo {
        private final String token;
        private final long expiry;

        public ResetTokenInfo(String token, long expiry) {
            this.token = token;
            this.expiry = expiry;
        }

        public String getToken() {
            return token;
        }

        public long getExpiry() {
            return expiry;
        }
    }

    /**
     * In-memory map of email -> ResetTokenInfo.
     * Key: user email
     * Value: token & expiry
     */
    private final Map<String, ResetTokenInfo> resetTokens = new ConcurrentHashMap<>();

    /**
     * How long the reset token is valid (e.g., 15 minutes).
     */
    private static final long TOKEN_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

    /**
     * Generates a new reset token for the given email and stores it in memory.
     *
     * @param email the email of the user requesting a reset
     * @return the newly generated reset token
     */
    public String createResetToken(String email) {
        // Generate a random token (UUID)
        String token = UUID.randomUUID().toString();

        // Calculate expiry time
        long expiryTime = System.currentTimeMillis() + TOKEN_EXPIRATION_MS;

        // Store in the map
        resetTokens.put(email, new ResetTokenInfo(token, expiryTime));

        return token;
    }

    /**
     * Validates whether the given token for the specified email is valid (exists and not expired).
     *
     * @param email the email associated with the token
     * @param token the reset token provided by the user
     * @return true if valid; false otherwise
     */
    public boolean validateResetToken(String email, String token) {
        if (!resetTokens.containsKey(email)) {
            return false;
        }

        ResetTokenInfo tokenInfo = resetTokens.get(email);
        if (tokenInfo == null) {
            return false;
        }

        // Check if token matches
        if (!tokenInfo.getToken().equals(token)) {
            return false;
        }

        // Check if token is expired
        if (System.currentTimeMillis() > tokenInfo.getExpiry()) {
            // Remove expired token
            resetTokens.remove(email);
            return false;
        }

        // Token is valid
        return true;
    }

    /**
     * Removes the token from the map after successful use or if you want to invalidate it.
     *
     * @param email the email whose token should be removed
     */
    public void removeResetToken(String email) {
        resetTokens.remove(email);
    }
}
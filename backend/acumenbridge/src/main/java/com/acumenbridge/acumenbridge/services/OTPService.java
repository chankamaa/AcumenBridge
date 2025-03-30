package com.acumenbridge.acumenbridge.services;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OTPService {
    // A simple store with email as key and OTP details as value
    private final ConcurrentHashMap<String, OTPDetails> otpStore = new ConcurrentHashMap<>();

    // Duration in minutes the OTP is valid
    private final int OTP_VALID_DURATION = 10;

    public void storeOTP(String email, String otp) {
        OTPDetails details = new OTPDetails(otp, LocalDateTime.now());
        otpStore.put(email, details);
    }

    public boolean validateOTP(String email, String otp) {
        OTPDetails details = otpStore.get(email);
        if (details == null) return false;
        // Check if OTP matches
        if (!details.getOtp().equals(otp)) return false;
        // Check if OTP has expired
        LocalDateTime expiryTime = details.getCreatedTime().plusMinutes(OTP_VALID_DURATION);
        return LocalDateTime.now().isBefore(expiryTime);
    }

    public void removeOTP(String email) {
        otpStore.remove(email);
    }

    // Nested class to hold OTP details
    public static class OTPDetails {
        private final String otp;
        private final LocalDateTime createdTime;

        public OTPDetails(String otp, LocalDateTime createdTime) {
            this.otp = otp;
            this.createdTime = createdTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getCreatedTime() {
            return createdTime;
        }
    }
}
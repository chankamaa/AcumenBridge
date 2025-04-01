package com.acumenbridge.acumenbridge.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // Create a MimeMessageHelper with multipart support and UTF-8 encoding
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Your OTP Code");

            // Use your Base64 encoded logo here (include the data URI prefix)
;

            String content = "<html><body style='font-family: Arial, sans-serif; margin:0; padding:0;'>" +
                    "<div style='background-color: #f9f9f9; padding: 20px;'>" +
                      "<div style='text-align: center;'>" +
                      "</div>" +
                      "<h2 style='color: #1E90FF; text-align: center;'>Your OTP Code</h2>" +
                      "<p style='font-size: 16px; text-align: center; margin: 20px 0;'>Please use the following OTP to complete your process. This OTP is valid for 10 minutes.</p>" +
                      "<div style='text-align: center; margin: 20px 0;'>" +
                        "<span style='font-size: 24px; font-weight: bold; background-color: #ffffff; padding: 10px 20px; border: 2px dashed #1E90FF; border-radius: 5px;'>" + otp + "</span>" +
                      "</div>" +
                      "<p style='text-align: center; font-size: 14px; color: #555;'>Simply highlight and copy the code above.</p>" +
                    "</div>" +
                  "</body></html>";

            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
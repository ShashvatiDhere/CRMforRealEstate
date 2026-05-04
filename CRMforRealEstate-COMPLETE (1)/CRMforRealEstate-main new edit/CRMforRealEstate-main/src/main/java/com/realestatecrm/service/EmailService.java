package com.realestatecrm.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("RealEstateCRM Login OTP");
        message.setText(
                "Hello,\n\n" +
                        "Your OTP for RealEstateCRM login is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "Do not share this OTP with anyone."
        );

        mailSender.send(message);
    }
}
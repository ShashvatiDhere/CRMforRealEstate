package com.realestatecrm.service;

import com.realestatecrm.dto.AuthResponse;
import com.realestatecrm.dto.RegisterAgentRequest;
import com.realestatecrm.entity.Role;
import com.realestatecrm.entity.User;
import com.realestatecrm.entity.UserStatus;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public String registerAgent(RegisterAgentRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Name is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User agent = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .role(Role.AGENT)
                .status(UserStatus.PENDING)
                .manager(null)
                .otp(null)
                .otpExpiry(null)
                .otpVerified(false)
                .build();

        userRepository.save(agent);

        return "Agent registration submitted. Wait for admin approval.";
    }

    public String sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User is not approved yet");
        }

        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setOtpVerified(false);

        userRepository.save(user);

        // System.out.println("OTP for " + email + " is: " + otp);   This will print on console

        // This sends OTP to mail
        emailService.sendOtpEmail(email, otp);

        return "OTP sent successfully";
    }

    public AuthResponse verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User is not approved yet");
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setOtpVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                "",
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );

        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    private String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
}
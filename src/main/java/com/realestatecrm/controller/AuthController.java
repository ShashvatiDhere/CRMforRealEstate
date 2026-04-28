package com.realestatecrm.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import com.realestatecrm.dto.*;
import com.realestatecrm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register-agent")
    public ResponseEntity<ApiResponse> registerAgent(@RequestBody RegisterAgentRequest request) {
        return ResponseEntity.ok(new ApiResponse(authService.registerAgent(request)));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendOtp(@RequestBody SendOtpRequest request) {
        return ResponseEntity.ok(new ApiResponse(authService.sendOtp(request.getEmail())));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request.getEmail(), request.getOtp()));
    }
}

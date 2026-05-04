package com.realestatecrm.controller;

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
    public ResponseEntity<ApiResponse<?>> registerAgent(@RequestBody RegisterAgentRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent registered",
                        authService.registerAgent(request))
        );
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<?>> sendOtp(@RequestBody SendOtpRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "OTP sent",
                        authService.sendOtp(request.getEmail()))
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<?>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "OTP verified",
                        authService.verifyOtp(request.getEmail(), request.getOtp()))
        );
    }
}
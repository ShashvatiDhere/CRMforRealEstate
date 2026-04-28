package com.realestatecrm.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import com.realestatecrm.dto.AgentApprovalRequest;
import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.CreateAdminRequest;
import com.realestatecrm.dto.CreateManagerRequest;
import com.realestatecrm.entity.User;
import com.realestatecrm.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse> createAdmin(@RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(new ApiResponse(adminService.createAdmin(request)));
    }

    @PostMapping("/create-manager")
    public ResponseEntity<ApiResponse> createManager(@RequestBody CreateManagerRequest request) {
        return ResponseEntity.ok(new ApiResponse(adminService.createManager(request)));
    }

    @GetMapping("/pending-agents")
    public ResponseEntity<List<User>> getPendingAgents() {
        return ResponseEntity.ok(adminService.getPendingAgents());
    }

    @GetMapping("/managers")
    public ResponseEntity<List<User>> getManagers() {
        return ResponseEntity.ok(adminService.getAllManagers());
    }

    @PutMapping("/approve-agent/{agentId}")
    public ResponseEntity<ApiResponse> approveAgent(
            @PathVariable Long agentId,
            @RequestBody AgentApprovalRequest request
    ) {
        return ResponseEntity.ok(new ApiResponse(adminService.approveOrRejectAgent(agentId, request)));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> adminDashboard() {
        return ResponseEntity.ok("Welcome Admin");
    }
}

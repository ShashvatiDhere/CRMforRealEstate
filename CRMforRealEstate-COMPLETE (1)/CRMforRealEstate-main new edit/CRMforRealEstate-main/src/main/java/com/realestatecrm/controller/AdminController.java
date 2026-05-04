package com.realestatecrm.controller;

import com.realestatecrm.dto.AgentApprovalRequest;
import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.CreateAdminRequest;
import com.realestatecrm.dto.CreateManagerRequest;
import com.realestatecrm.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Public endpoint to bootstrap first admin (no auth required)
    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<?>> createAdmin(@RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Admin created", adminService.createAdmin(request))
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-manager")
    public ResponseEntity<ApiResponse<?>> createManager(@RequestBody CreateManagerRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Manager created", adminService.createManager(request))
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending-agents")
    public ResponseEntity<ApiResponse<?>> getPendingAgents() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Pending agents fetched", adminService.getPendingAgents())
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/managers")
    public ResponseEntity<ApiResponse<?>> getManagers() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Managers fetched", adminService.getAllManagers())
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/agents")
    public ResponseEntity<ApiResponse<?>> getAgents() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agents fetched", adminService.getAllAgents())
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve-agent/{agentId}")
    public ResponseEntity<ApiResponse<?>> approveAgent(
            @PathVariable Long agentId,
            @RequestBody AgentApprovalRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent approval updated",
                        adminService.approveOrRejectAgent(agentId, request))
        );
    }
}

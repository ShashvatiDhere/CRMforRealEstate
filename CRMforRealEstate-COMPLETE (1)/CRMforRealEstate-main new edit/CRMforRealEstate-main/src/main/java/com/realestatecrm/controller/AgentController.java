package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.entity.User;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.service.LeadService;
import com.realestatecrm.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {

    private final LeadService leadService;
    private final PropertyService propertyService;
    private final UserRepository userRepository;

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/my-leads")
    public ResponseEntity<ApiResponse<?>> getMyLeads(Authentication authentication) {
        User agent = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent leads fetched",
                        leadService.getAgentLeads(agent.getId()))
        );
    }

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/my-properties")
    public ResponseEntity<ApiResponse<?>> getMyProperties(Authentication authentication) {
        User agent = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent properties fetched",
                        propertyService.getPropertiesByAgent(agent.getId()))
        );
    }

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<?>> agentDashboard() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Welcome Agent", null)
        );
    }
}

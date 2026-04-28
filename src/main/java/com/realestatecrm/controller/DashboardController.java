package com.realestatecrm.controller;

import com.realestatecrm.entity.User;
import com.realestatecrm.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import com.realestatecrm.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping("/admin")
    public Map<String, Object> adminDashboard() {
        return dashboardService.adminDashboard();
    }

    @GetMapping("/manager")
    public Map<String, Object> managerDashboard() {
        return dashboardService.managerDashboard();
    }

    @GetMapping("/agent/{agentId}")
    public Map<String, Object> agentDashboard(@PathVariable Long agentId) {
        return dashboardService.agentDashboard(agentId);
    }

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/agent")
    public Map<String, Object> agentDashboard(Authentication authentication) {
        User agent = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return dashboardService.agentDashboard(agent.getId());
    }
}
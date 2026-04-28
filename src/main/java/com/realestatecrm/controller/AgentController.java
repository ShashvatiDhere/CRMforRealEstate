package com.realestatecrm.controller;

import com.realestatecrm.entity.Lead;
import com.realestatecrm.entity.User;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {

    private final LeadService leadService;
    private final UserRepository userRepository;

    @GetMapping("/my-leads")
    public ResponseEntity<List<Lead>> getMyLeads(Authentication authentication) {

        User agent = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return ResponseEntity.ok(leadService.getAgentLeads(agent.getId()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> agentDashboard() {
        return ResponseEntity.ok("Welcome Agent");
    }
}
package com.realestatecrm.controller;

import com.realestatecrm.dto.AssignLeadRequest;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.entity.Lead;
import com.realestatecrm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final LeadService leadService;

    @PostMapping("/leads")
    public ResponseEntity<Lead> createLead(@RequestBody LeadRequest request) {
        return ResponseEntity.ok(leadService.createLead(request));
    }

    @PutMapping("/assign-lead/{leadId}")
    public ResponseEntity<Lead> assignLead(@PathVariable Long leadId,
                                           @RequestBody AssignLeadRequest request) {
        return ResponseEntity.ok(
                leadService.assignLead(leadId, request.getAgentId())
        );
    }

    @GetMapping("/leads")
    public ResponseEntity<List<Lead>> getManagerLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> managerDashboard() {
        return ResponseEntity.ok("Welcome Manager");
    }
}
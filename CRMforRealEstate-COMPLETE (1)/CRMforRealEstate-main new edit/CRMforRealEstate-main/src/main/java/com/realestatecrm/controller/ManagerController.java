package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.AssignLeadRequest;
import com.realestatecrm.dto.AssignPropertyToAgentRequest;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.service.LeadService;
import com.realestatecrm.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final LeadService leadService;
    private final PropertyService propertyService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/leads")
    public ResponseEntity<ApiResponse<?>> createLead(@RequestBody LeadRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lead created", leadService.createLead(request))
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/assign-lead/{leadId}")
    public ResponseEntity<ApiResponse<?>> assignLead(
            @PathVariable Long leadId,
            @RequestBody AssignLeadRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lead assigned to agent",
                        leadService.assignLead(leadId, request.getAgentId()))
        );
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/leads")
    public ResponseEntity<ApiResponse<?>> getManagerLeads() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Leads fetched", leadService.getAllLeads())
        );
    }

    // Assign property to agent (manager-side shortcut endpoint)
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/assign-property/{propertyId}/agent")
    public ResponseEntity<ApiResponse<?>> assignPropertyToAgent(
            @PathVariable Long propertyId,
            @RequestBody AssignPropertyToAgentRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Property assigned to agent",
                        propertyService.assignPropertyToAgent(propertyId, request))
        );
    }

    // Agent tracking - view leads for a specific agent
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/agents/{agentId}/leads")
    public ResponseEntity<ApiResponse<?>> getAgentLeads(@PathVariable Long agentId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent leads fetched",
                        leadService.getLeadsByAgent(agentId))
        );
    }

    // Agent tracking - view properties for a specific agent
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/agents/{agentId}/properties")
    public ResponseEntity<ApiResponse<?>> getAgentProperties(@PathVariable Long agentId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent properties fetched",
                        propertyService.getPropertiesByAgent(agentId))
        );
    }
}

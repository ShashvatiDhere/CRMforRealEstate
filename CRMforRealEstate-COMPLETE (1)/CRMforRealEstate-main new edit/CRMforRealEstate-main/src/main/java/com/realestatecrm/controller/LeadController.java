package com.realestatecrm.controller;

import com.realestatecrm.dto.*;
import com.realestatecrm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createLead(@RequestBody LeadRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lead created", leadService.createLead(request))
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllLeads() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Leads fetched", leadService.getAllLeads())
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<ApiResponse<?>> getAgentLeads(@PathVariable Long agentId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent leads fetched",
                        leadService.getAgentLeads(agentId))
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/{leadId}/assign")
    public ResponseEntity<ApiResponse<?>> assignLead(
            @PathVariable Long leadId,
            @RequestBody AssignLeadRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lead assigned",
                        leadService.assignLead(leadId, request.getAgentId()))
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    @PutMapping("/{leadId}/status")
    public ResponseEntity<ApiResponse<?>> updateLeadStatus(
            @PathVariable Long leadId,
            @RequestBody LeadStatusRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Status updated",
                        leadService.updateLeadStatus(leadId, request.getStatus()))
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/leads")
    public ResponseEntity<ApiResponse<Page<?>>> getLeads(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Leads fetched",
                        leadService.getLeads(search, page, size))
        );
    }
}

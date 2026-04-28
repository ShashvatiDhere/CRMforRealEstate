package com.realestatecrm.controller;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import com.realestatecrm.dto.AssignLeadRequest;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.dto.LeadStatusRequest;
import com.realestatecrm.entity.Lead;
import com.realestatecrm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public Lead createLead(@RequestBody LeadRequest request) {
        return leadService.createLead(request);
    }

    @GetMapping
    public List<Lead> getAllLeads() {
        return leadService.getAllLeads();
    }

    @GetMapping("/agent/{agentId}")
    public List<Lead> getAgentLeads(@PathVariable Long agentId) {
        return leadService.getAgentLeads(agentId);
    }

    @PostMapping("/{leadId}/assign")
    public Lead assignLead(@PathVariable Long leadId,
                           @RequestBody AssignLeadRequest request) {
        return leadService.assignLead(leadId, request.getAgentId());
    }

    @PutMapping("/{leadId}/status")
    public Lead updateLeadStatus(@PathVariable Long leadId,
                                 @RequestBody LeadStatusRequest request) {
        return leadService.updateLeadStatus(leadId, request.getStatus());
    }

    @GetMapping("/leads")
    public Page<Lead> getLeads(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return leadService.getLeads(search, page, size);
    }
}
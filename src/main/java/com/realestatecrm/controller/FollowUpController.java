package com.realestatecrm.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import com.realestatecrm.dto.FollowUpRequest;
import com.realestatecrm.entity.FollowUp;
import com.realestatecrm.service.FollowUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followups")
@RequiredArgsConstructor
public class FollowUpController {

    private final FollowUpService followUpService;

    @PostMapping
    public FollowUp createFollowUp(@RequestBody FollowUpRequest request) {
        return followUpService.createFollowUp(request);
    }

    @GetMapping("/lead/{leadId}")
    public List<FollowUp> getFollowUpsByLead(@PathVariable Long leadId) {
        return followUpService.getFollowUpsByLead(leadId);
    }

    @GetMapping("/agent/{agentId}")
    public List<FollowUp> getFollowUpsByAgent(@PathVariable Long agentId) {
        return followUpService.getFollowUpsByAgent(agentId);
    }

    @PutMapping("/{id}/complete")
    public FollowUp completeFollowUp(@PathVariable Long id) {
        return followUpService.completeFollowUp(id);
    }
}
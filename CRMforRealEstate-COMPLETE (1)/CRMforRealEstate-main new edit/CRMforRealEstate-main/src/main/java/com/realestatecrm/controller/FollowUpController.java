package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.FollowUpRequest;
import com.realestatecrm.service.FollowUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/followups")
@RequiredArgsConstructor
public class FollowUpController {

    private final FollowUpService followUpService;

    @PreAuthorize("hasAnyRole('AGENT','MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createFollowUp(@RequestBody FollowUpRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Follow-up created",
                        followUpService.createFollowUp(request))
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    @GetMapping("/lead/{leadId}")
    public ResponseEntity<ApiResponse<?>> getFollowUpsByLead(@PathVariable Long leadId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Follow-ups fetched",
                        followUpService.getFollowUpsByLead(leadId))
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<ApiResponse<?>> getFollowUpsByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent follow-ups fetched",
                        followUpService.getFollowUpsByAgent(agentId))
        );
    }

    @PreAuthorize("hasAnyRole('AGENT','MANAGER')")
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<?>> completeFollowUp(@PathVariable Long id) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Follow-up completed",
                        followUpService.completeFollowUp(id))
        );
    }
}

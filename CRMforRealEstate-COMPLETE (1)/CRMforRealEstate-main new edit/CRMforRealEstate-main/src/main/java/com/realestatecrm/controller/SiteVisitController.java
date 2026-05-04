package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.SiteVisitRequest;
import com.realestatecrm.dto.StatusUpdateRequest;
import com.realestatecrm.service.SiteVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/site-visits")
@RequiredArgsConstructor
public class SiteVisitController {

    private final SiteVisitService siteVisitService;

    @PreAuthorize("hasAnyRole('AGENT','MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createSiteVisit(@RequestBody SiteVisitRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Site visit created",
                        siteVisitService.createSiteVisit(request))
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllSiteVisits() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Site visits fetched",
                        siteVisitService.getAllSiteVisits())
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<ApiResponse<?>> getVisitsByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Agent visits fetched",
                        siteVisitService.getVisitsByAgent(agentId))
        );
    }

    @PreAuthorize("hasAnyRole('AGENT','MANAGER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateVisitStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Visit status updated",
                        siteVisitService.updateVisitStatus(id, request.getStatus()))
        );
    }
}

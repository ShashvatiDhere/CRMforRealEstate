package com.realestatecrm.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import com.realestatecrm.dto.SiteVisitRequest;
import com.realestatecrm.dto.StatusUpdateRequest;
import com.realestatecrm.entity.SiteVisit;
import com.realestatecrm.service.SiteVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/site-visits")
@RequiredArgsConstructor
public class SiteVisitController {

    private final SiteVisitService siteVisitService;

    @PostMapping
    public SiteVisit createSiteVisit(@RequestBody SiteVisitRequest request) {
        return siteVisitService.createSiteVisit(request);
    }

    @GetMapping
    public List<SiteVisit> getAllSiteVisits() {
        return siteVisitService.getAllSiteVisits();
    }

    @GetMapping("/agent/{agentId}")
    public List<SiteVisit> getVisitsByAgent(@PathVariable Long agentId) {
        return siteVisitService.getVisitsByAgent(agentId);
    }

    @PutMapping("/{id}/status")
    public SiteVisit updateVisitStatus(@PathVariable Long id,
                                       @RequestBody StatusUpdateRequest request) {
        return siteVisitService.updateVisitStatus(id, request.getStatus());
    }
}
package com.realestatecrm.service;

import com.realestatecrm.dto.SiteVisitRequest;
import com.realestatecrm.entity.*;
import com.realestatecrm.repository.LeadRepository;
import com.realestatecrm.repository.PropertyRepository;
import com.realestatecrm.repository.SiteVisitRepository;
import com.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteVisitService {

    private final SiteVisitRepository siteVisitRepository;
    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public SiteVisit createSiteVisit(SiteVisitRequest request) {

        Lead lead = leadRepository.findById(request.getLeadId())
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        User agent = userRepository.findById(request.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != Role.AGENT) {
            throw new RuntimeException("User is not an agent");
        }

        SiteVisit siteVisit = SiteVisit.builder()
                .lead(lead)
                .property(property)
                .agent(agent)
                .visitDate(request.getVisitDate())
                .feedback(request.getFeedback())
                .visitStatus(VisitStatus.SCHEDULED)
                .createdAt(LocalDateTime.now())
                .build();

        return siteVisitRepository.save(siteVisit);
    }

    public List<SiteVisit> getAllSiteVisits() {
        return siteVisitRepository.findAll();
    }

    public List<SiteVisit> getVisitsByAgent(Long agentId) {
        return siteVisitRepository.findByAgentId(agentId);
    }

    public SiteVisit updateVisitStatus(Long id, String status) {
        SiteVisit visit = siteVisitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Site visit not found"));

        visit.setVisitStatus(VisitStatus.valueOf(status.toUpperCase()));

        return siteVisitRepository.save(visit);
    }
}
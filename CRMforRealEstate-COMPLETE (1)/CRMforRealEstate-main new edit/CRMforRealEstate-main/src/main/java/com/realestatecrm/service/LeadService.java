package com.realestatecrm.service;

import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.entity.*;
import com.realestatecrm.repository.LeadRepository;
import com.realestatecrm.repository.PropertyRepository;
import com.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public Lead createLead(LeadRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Lead lead = Lead.builder()
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .property(property)
                .budget(request.getBudget())
                .source(request.getSource())
                .status(LeadStatus.NEW)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return leadRepository.save(lead);
    }

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public List<Lead> getAgentLeads(Long agentId) {
        return leadRepository.findByAssignedAgentId(agentId);
    }

    // Alias for getAgentLeads (used by ManagerController for agent tracking)
    public List<Lead> getLeadsByAgent(Long agentId) {
        return leadRepository.findByAssignedAgentId(agentId);
    }

    public Lead getLead(Long leadId) {
        return leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + leadId));
    }

    public Lead assignLead(Long leadId, Long agentId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != Role.AGENT) {
            throw new RuntimeException("User is not an agent");
        }

        lead.setAssignedAgent(agent);
        lead.setUpdatedAt(LocalDateTime.now());
        return leadRepository.save(lead);
    }

    public Lead updateLeadStatus(Long leadId, String status) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        lead.setStatus(LeadStatus.valueOf(status.toUpperCase()));
        lead.setUpdatedAt(LocalDateTime.now());
        return leadRepository.save(lead);
    }

    public Page<Lead> getLeads(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (search != null && !search.isBlank()) {
            return leadRepository.findByCustomerNameContainingIgnoreCase(search, pageable);
        }

        return leadRepository.findAll(pageable);
    }
}

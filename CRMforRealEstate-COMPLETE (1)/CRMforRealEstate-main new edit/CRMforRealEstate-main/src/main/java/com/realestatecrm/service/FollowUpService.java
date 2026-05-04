package com.realestatecrm.service;

import com.realestatecrm.dto.FollowUpRequest;
import com.realestatecrm.entity.*;
import com.realestatecrm.repository.FollowUpRepository;
import com.realestatecrm.repository.LeadRepository;
import com.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    public FollowUp createFollowUp(FollowUpRequest request) {

        Lead lead = leadRepository.findById(request.getLeadId())
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        User agent = userRepository.findById(request.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != Role.AGENT) {
            throw new RuntimeException("User is not an agent");
        }

        FollowUp followUp = FollowUp.builder()
                .lead(lead)
                .agent(agent)
                .followUpDate(request.getFollowUpDate())
                .note(request.getNote())
                .status(FollowUpStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return followUpRepository.save(followUp);
    }

    public List<FollowUp> getFollowUpsByLead(Long leadId) {
        return followUpRepository.findByLeadId(leadId);
    }

    public List<FollowUp> getFollowUpsByAgent(Long agentId) {
        return followUpRepository.findByAgentId(agentId);
    }

    public FollowUp completeFollowUp(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Follow-up not found"));

        followUp.setStatus(FollowUpStatus.COMPLETED);

        return followUpRepository.save(followUp);
    }
}
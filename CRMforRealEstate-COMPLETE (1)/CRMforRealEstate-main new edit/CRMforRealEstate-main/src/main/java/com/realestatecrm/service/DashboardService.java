package com.realestatecrm.service;

import com.realestatecrm.entity.*;
import com.realestatecrm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final FollowUpRepository followUpRepository;
    private final SiteVisitRepository siteVisitRepository;

    public Map<String, Object> adminDashboard() {
        Map<String, Object> data = new HashMap<>();

        data.put("totalUsers", userRepository.count());
        data.put("totalManagers", userRepository.countByRole(Role.MANAGER));
        data.put("totalAgents", userRepository.countByRole(Role.AGENT));
        data.put("pendingUsers", userRepository.countByStatus(UserStatus.PENDING));

        data.put("totalProperties", propertyRepository.count());
        data.put("availableProperties", propertyRepository.countByStatus(PropertyStatus.AVAILABLE));
        data.put("soldProperties", propertyRepository.countByStatus(PropertyStatus.SOLD));

        data.put("totalLeads", leadRepository.count());
        data.put("newLeads", leadRepository.countByStatus(LeadStatus.NEW));
        data.put("bookings", leadRepository.countByStatus(LeadStatus.BOOKING));

        data.put("pendingFollowUps", followUpRepository.countByStatus(FollowUpStatus.PENDING));
        data.put("scheduledVisits", siteVisitRepository.countByVisitStatus(VisitStatus.SCHEDULED));

        return data;
    }

    public Map<String, Object> managerDashboard() {
        Map<String, Object> data = new HashMap<>();

        data.put("totalProperties", propertyRepository.count());
        data.put("availableProperties", propertyRepository.countByStatus(PropertyStatus.AVAILABLE));
        data.put("totalLeads", leadRepository.count());
        data.put("newLeads", leadRepository.countByStatus(LeadStatus.NEW));
        data.put("bookings", leadRepository.countByStatus(LeadStatus.BOOKING));
        data.put("pendingFollowUps", followUpRepository.countByStatus(FollowUpStatus.PENDING));
        data.put("scheduledVisits", siteVisitRepository.countByVisitStatus(VisitStatus.SCHEDULED));

        return data;
    }

    public Map<String, Object> agentDashboard(Long agentId) {
        Map<String, Object> data = new HashMap<>();

        data.put("myLeads", leadRepository.countByAssignedAgentId(agentId));
        data.put("pendingFollowUps", followUpRepository.countByStatus(FollowUpStatus.PENDING));
        data.put("scheduledVisits", siteVisitRepository.countByVisitStatus(VisitStatus.SCHEDULED));

        return data;
    }
}
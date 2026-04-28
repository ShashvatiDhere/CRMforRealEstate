package com.realestatecrm.repository;

import com.realestatecrm.entity.FollowUp;
import com.realestatecrm.entity.FollowUpStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

    List<FollowUp> findByLeadId(Long leadId);

    List<FollowUp> findByAgentId(Long agentId);

    List<FollowUp> findByStatus(FollowUpStatus status);
    long countByStatus(FollowUpStatus status);
}
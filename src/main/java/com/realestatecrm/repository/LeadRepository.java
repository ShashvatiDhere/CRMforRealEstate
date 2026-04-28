package com.realestatecrm.repository;

import com.realestatecrm.entity.Lead;
import com.realestatecrm.entity.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findByAssignedAgentId(Long agentId);

    List<Lead> findByCreatedById(Long userId);

    List<Lead> findByStatus(LeadStatus status);
    long countByStatus(LeadStatus status);
    long countByAssignedAgentId(Long agentId);

    Page<Lead> findByCustomerNameContainingIgnoreCase(String name, Pageable pageable);
}
package com.realestatecrm.repository;

import com.realestatecrm.entity.SiteVisit;
import com.realestatecrm.entity.VisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteVisitRepository extends JpaRepository<SiteVisit, Long> {

    List<SiteVisit> findByLeadId(Long leadId);

    List<SiteVisit> findByAgentId(Long agentId);

    List<SiteVisit> findByVisitStatus(VisitStatus visitStatus);
    long countByVisitStatus(VisitStatus visitStatus);
}
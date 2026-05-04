package com.realestatecrm.repository;

import com.realestatecrm.entity.Property;
import com.realestatecrm.entity.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByStatus(PropertyStatus status);
    List<Property> findByLocationContainingIgnoreCase(String location);
    long countByStatus(PropertyStatus status);
    List<Property> findByAssignedManagerId(Long managerId);
    List<Property> findByAssignedAgentId(Long agentId);
}

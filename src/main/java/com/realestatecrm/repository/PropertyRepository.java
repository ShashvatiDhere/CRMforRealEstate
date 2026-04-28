package com.realestatecrm.repository;

import com.realestatecrm.entity.Property;
import com.realestatecrm.entity.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByStatus(PropertyStatus status);

    List<Property> findByLocationContainingIgnoreCase(String location);
    long countByStatus(PropertyStatus status);
}
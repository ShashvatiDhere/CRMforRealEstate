package com.realestatecrm.service;

import com.realestatecrm.dto.AssignPropertyToAgentRequest;
import com.realestatecrm.dto.AssignPropertyToManagerRequest;
import com.realestatecrm.dto.PropertyRequest;
import com.realestatecrm.entity.*;
import com.realestatecrm.repository.PropertyRepository;
import com.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public Property createProperty(PropertyRequest request) {
        Property property = Property.builder()
                .title(request.getTitle())
                .propertyType(PropertyType.valueOf(request.getPropertyType().toUpperCase()))
                .location(request.getLocation())
                .price(request.getPrice())
                .bhk(request.getBhk())
                .areaSqft(request.getAreaSqft())
                .description(request.getDescription())
                .status(PropertyStatus.AVAILABLE)
                .createdAt(LocalDateTime.now())
                .build();

        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
    }

    public Property updateProperty(Long id, PropertyRequest request) {
        Property property = getPropertyById(id);
        property.setTitle(request.getTitle());
        property.setPropertyType(PropertyType.valueOf(request.getPropertyType().toUpperCase()));
        property.setLocation(request.getLocation());
        property.setPrice(request.getPrice());
        property.setBhk(request.getBhk());
        property.setAreaSqft(request.getAreaSqft());
        property.setDescription(request.getDescription());
        return propertyRepository.save(property);
    }

    public void deleteProperty(Long id) {
        Property property = getPropertyById(id);
        propertyRepository.delete(property);
    }

    public Property assignPropertyToManager(Long propertyId, AssignPropertyToManagerRequest request) {
        Property property = getPropertyById(propertyId);

        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found with id: " + request.getManagerId()));

        if (manager.getRole() != Role.MANAGER) {
            throw new RuntimeException("User with id " + request.getManagerId() + " is not a Manager");
        }

        property.setAssignedManager(manager);
        return propertyRepository.save(property);
    }

    public Property assignPropertyToAgent(Long propertyId, AssignPropertyToAgentRequest request) {
        Property property = getPropertyById(propertyId);

        User agent = userRepository.findById(request.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found with id: " + request.getAgentId()));

        if (agent.getRole() != Role.AGENT) {
            throw new RuntimeException("User with id " + request.getAgentId() + " is not an Agent");
        }

        property.setAssignedAgent(agent);
        return propertyRepository.save(property);
    }

    public List<Property> getPropertiesByManager(Long managerId) {
        return propertyRepository.findByAssignedManagerId(managerId);
    }

    public List<Property> getPropertiesByAgent(Long agentId) {
        return propertyRepository.findByAssignedAgentId(agentId);
    }
}

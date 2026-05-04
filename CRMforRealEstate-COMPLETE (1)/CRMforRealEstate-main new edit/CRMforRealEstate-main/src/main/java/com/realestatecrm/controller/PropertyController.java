package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.AssignPropertyToAgentRequest;
import com.realestatecrm.dto.AssignPropertyToManagerRequest;
import com.realestatecrm.dto.PropertyRequest;
import com.realestatecrm.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createProperty(@RequestBody PropertyRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Property created", propertyService.createProperty(request))
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllProperties() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Properties fetched", propertyService.getAllProperties())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Property fetched", propertyService.getPropertyById(id))
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Property updated", propertyService.updateProperty(id, request))
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Property deleted", null));
    }

    // Admin assigns property to a Manager
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{propertyId}/assign-manager")
    public ResponseEntity<ApiResponse<?>> assignPropertyToManager(
            @PathVariable Long propertyId,
            @RequestBody AssignPropertyToManagerRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Property assigned to manager",
                        propertyService.assignPropertyToManager(propertyId, request))
        );
    }

    // Manager assigns property to an Agent
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{propertyId}/assign-agent")
    public ResponseEntity<ApiResponse<?>> assignPropertyToAgent(
            @PathVariable Long propertyId,
            @RequestBody AssignPropertyToAgentRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Property assigned to agent",
                        propertyService.assignPropertyToAgent(propertyId, request))
        );
    }

    // Get properties assigned to a specific manager
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<ApiResponse<?>> getPropertiesByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Properties for manager fetched",
                        propertyService.getPropertiesByManager(managerId))
        );
    }

    // Get properties assigned to a specific agent
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<ApiResponse<?>> getPropertiesByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Properties for agent fetched",
                        propertyService.getPropertiesByAgent(agentId))
        );
    }
}

package com.realestatecrm.controller;

import com.realestatecrm.dto.PropertyRequest;
import com.realestatecrm.entity.Property;
import com.realestatecrm.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Property createProperty(@RequestBody PropertyRequest request) {
        return propertyService.createProperty(request);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','AGENT')")
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable Long id,
                                   @RequestBody PropertyRequest request) {
        return propertyService.updateProperty(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return "Property deleted successfully";
    }
}
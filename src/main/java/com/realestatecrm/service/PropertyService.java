package com.realestatecrm.service;

import com.realestatecrm.dto.MapLocationResponse;
import com.realestatecrm.dto.PropertyRequest;
import com.realestatecrm.entity.Property;
import com.realestatecrm.entity.PropertyStatus;
import com.realestatecrm.entity.PropertyType;
import com.realestatecrm.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final GoogleMapService googleMapService;

    public Property createProperty(PropertyRequest request) {

        MapLocationResponse mapLocation =
                googleMapService.getLocationFromAddress(request.getLocation());

        Property property = Property.builder()
                .title(request.getTitle())
                .propertyType(PropertyType.valueOf(request.getPropertyType().toUpperCase()))
                .location(request.getLocation())
                .formattedAddress(mapLocation.getFormattedAddress())
                .latitude(mapLocation.getLatitude())
                .longitude(mapLocation.getLongitude())
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
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    public Property updateProperty(Long id, PropertyRequest request) {

        Property property = getPropertyById(id);

        MapLocationResponse mapLocation =
                googleMapService.getLocationFromAddress(request.getLocation());

        property.setTitle(request.getTitle());
        property.setPropertyType(PropertyType.valueOf(request.getPropertyType().toUpperCase()));
        property.setLocation(request.getLocation());
        property.setFormattedAddress(mapLocation.getFormattedAddress());
        property.setLatitude(mapLocation.getLatitude());
        property.setLongitude(mapLocation.getLongitude());
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
}
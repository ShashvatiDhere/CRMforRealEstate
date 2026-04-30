package com.realestatecrm.controller;

import com.realestatecrm.dto.MapLocationResponse;
import com.realestatecrm.service.GoogleMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maps")
@RequiredArgsConstructor
public class GoogleMapController {

    private final GoogleMapService googleMapService;

    @GetMapping("/geocode")
    public MapLocationResponse getLocation(@RequestParam String address) {
        return googleMapService.getLocationFromAddress(address);
    }
}
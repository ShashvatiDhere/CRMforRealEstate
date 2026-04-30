package com.realestatecrm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.realestatecrm.dto.MapLocationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GoogleMapService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    @Value("${google.maps.geocode.url}")
    private String geocodeUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public MapLocationResponse getLocationFromAddress(String address) {

        if (address == null || address.trim().isEmpty()) {
            throw new RuntimeException("Property location/address is required");
        }

        String url = UriComponentsBuilder
                .fromHttpUrl(geocodeUrl)
                .queryParam("address", address)
                .queryParam("key", apiKey)
                .toUriString();

        JsonNode response = restTemplate.getForObject(url, JsonNode.class);

        if (response == null) {
            throw new RuntimeException("No response received from Google Maps API");
        }

        String status = response.get("status").asText();

        if (!"OK".equals(status)) {
            throw new RuntimeException("Google Maps API error: " + status);
        }

        JsonNode firstResult = response.get("results").get(0);

        String formattedAddress = firstResult.get("formatted_address").asText();

        JsonNode location = firstResult
                .get("geometry")
                .get("location");

        Double latitude = location.get("lat").asDouble();
        Double longitude = location.get("lng").asDouble();

        return new MapLocationResponse(formattedAddress, latitude, longitude);
    }
}
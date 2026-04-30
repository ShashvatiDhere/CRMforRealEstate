package com.realestatecrm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MapLocationResponse {

    private String formattedAddress;
    private Double latitude;
    private Double longitude;
}
package com.realestatecrm.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateLeadRequest {
    private String propertyId;
    private String propertyType;
    private String city;
    private String locality;
    private Double salePrice;
    private LocalDate saleDate;
    private String agentName;
    private Double commission;
}

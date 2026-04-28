package com.realestatecrm.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PropertyRequest {
    private String title;
    private String propertyType;
    private String location;
    private BigDecimal price;
    private Integer bhk;
    private Double areaSqft;
    private String description;
}
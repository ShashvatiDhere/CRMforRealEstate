package com.realestatecrm.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SiteVisitRequest {
    private Long leadId;
    private Long propertyId;
    private Long agentId;
    private LocalDateTime visitDate;
    private String feedback;
}
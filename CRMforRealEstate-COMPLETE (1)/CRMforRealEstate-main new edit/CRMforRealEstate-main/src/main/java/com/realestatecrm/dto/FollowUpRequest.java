package com.realestatecrm.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FollowUpRequest {
    private Long leadId;
    private Long agentId;
    private LocalDateTime followUpDate;
    private String note;
}
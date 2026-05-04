package com.realestatecrm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgentApprovalRequest {
    private boolean approved;
    private Long managerId;
}

package com.realestatecrm.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LeadRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @Email(message = "Invalid customer email")
    private String customerEmail;

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Budget is required")
    private BigDecimal budget;

    private String source;
}
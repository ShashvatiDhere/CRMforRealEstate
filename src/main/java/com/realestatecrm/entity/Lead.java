package com.realestatecrm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerPhone;
    private String customerEmail;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private BigDecimal budget;

    private String source;

    @Enumerated(EnumType.STRING)
    private LeadStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
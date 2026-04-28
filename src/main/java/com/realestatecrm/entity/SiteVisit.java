package com.realestatecrm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "site_visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    private LocalDateTime visitDate;

    @Enumerated(EnumType.STRING)
    private VisitStatus visitStatus;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime createdAt;
}
package com.acumenbridge.acumenbridge.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "learningPlans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPlan {
    @Id
    private String id;
    private String userId;
    private String topic;
    private String description;
    private List<String> resources;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Field("originalPlanId")  // MongoDB field annotation
    private String originalPlanId; // Add this new field for tracking reposts
    
    // For plans that have been reposted multiple times
    @Field("repostCount")
    private Integer repostCount; // Optional: track how many times it's been reposted
}
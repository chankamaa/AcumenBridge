// models/LearningPlan.java

package com.acumenbridge.acumenbridge.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "learningPlans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class LearningPlan {

    @Id
    private String id;

    private String topic;
    private String description;
    private List<String> resources;
    private LocalDate startDate;
    private LocalDate endDate;
    
}

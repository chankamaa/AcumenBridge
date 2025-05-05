// models/Progress.java

package com.acumenbridge.acumenbridge.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "progress")
public class Progress {
    @Id
    private String id;
    private String userId;
    private String achievementType;
    private String head;
    private String description;
    private int completed;
    private int toComplete;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
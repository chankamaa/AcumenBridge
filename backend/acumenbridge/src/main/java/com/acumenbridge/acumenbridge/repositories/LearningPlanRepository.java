// repositories/LearningPlanRepository.java

package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    
}

package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByUserId(String userId);
    Optional<Progress> findByIdAndUserId(String id, String userId); // Changed to return Optional
}
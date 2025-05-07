package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressRepository extends MongoRepository<Progress, String> {
}


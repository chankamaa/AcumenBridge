package com.acumenbridge.acumenbridge.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.acumenbridge.acumenbridge.models.User;

public interface UserRepository extends MongoRepository<User, String> {
    // You can add custom query methods here, e.g.:
    // Optional<User> findByEmail(String email);
}
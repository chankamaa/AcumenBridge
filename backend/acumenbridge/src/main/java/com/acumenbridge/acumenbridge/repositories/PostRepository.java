package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    /**
     * Find all posts created by a single user, ordered by creation timestamp descending.
     * (For that user’s profile page.)
     */
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Find all posts created by any of the given users,
     * ordered by creation timestamp descending.
     * (For the home feed of followed users.)
     */
    List<Post> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);
}

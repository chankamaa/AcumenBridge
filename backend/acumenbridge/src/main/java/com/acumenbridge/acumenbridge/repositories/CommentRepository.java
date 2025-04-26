// src/main/java/com/acumenbridge/acumenbridge/repositories/CommentRepository.java
package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
  List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
}

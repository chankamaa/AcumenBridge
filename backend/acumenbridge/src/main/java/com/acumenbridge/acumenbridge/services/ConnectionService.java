package com.acumenbridge.acumenbridge.services;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Allows the current user to follow a target user.
     * @param currentUserEmail the email of the current (logged-in) user
     * @param targetUserId the ID of the user to follow
     * @return a status message
     */
    public String followUser(String currentUserEmail, String targetUserId) {
        Optional<User> optionalCurrent = userRepository.findByEmail(currentUserEmail);
        Optional<User> optionalTarget = userRepository.findById(targetUserId);

        if (!optionalCurrent.isPresent() || !optionalTarget.isPresent()) {
            return "User not found";
        }

        User currentUser = optionalCurrent.get();
        User targetUser = optionalTarget.get();

        // Add the target user's ID to the current user's following list if not already present
        if (!currentUser.getFollowing().contains(targetUserId)) {
            currentUser.getFollowing().add(targetUserId);
        }
        // Add the current user's ID to the target user's followers list if not already present
        if (!targetUser.getFollowers().contains(currentUser.getId())) {
            targetUser.getFollowers().add(currentUser.getId());
        }

        userRepository.save(currentUser);
        userRepository.save(targetUser);
        return "Now following " + targetUser.getName();
    }

    /**
     * Allows the current user to unfollow a target user.
     * @param currentUserEmail the email of the current (logged-in) user
     * @param targetUserId the ID of the user to unfollow
     * @return a status message
     */
    public String unfollowUser(String currentUserEmail, String targetUserId) {
        Optional<User> optionalCurrent = userRepository.findByEmail(currentUserEmail);
        Optional<User> optionalTarget = userRepository.findById(targetUserId);

        if (!optionalCurrent.isPresent() || !optionalTarget.isPresent()) {
            return "User not found";
        }

        User currentUser = optionalCurrent.get();
        User targetUser = optionalTarget.get();

        currentUser.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(currentUser.getId());

        userRepository.save(currentUser);
        userRepository.save(targetUser);
        return "Unfollowed " + targetUser.getName();
    }

    /**
     * Retrieves the list of user IDs who follow the current user.
     * @param currentUserEmail the email of the current user
     * @return the list of follower IDs
     */
    public List<String> getFollowers(String currentUserEmail) {
        Optional<User> optionalUser = userRepository.findByEmail(currentUserEmail);
        return optionalUser.map(User::getFollowers).orElse(null);
    }

    /**
     * Retrieves the list of user IDs the current user is following.
     * @param currentUserEmail the email of the current user
     * @return the list of following IDs
     */
    public List<String> getFollowing(String currentUserEmail) {
        Optional<User> optionalUser = userRepository.findByEmail(currentUserEmail);
        return optionalUser.map(User::getFollowing).orElse(null);
    }
}
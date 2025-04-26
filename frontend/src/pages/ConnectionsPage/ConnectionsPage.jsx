// src/pages/ConnectionsPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FollowedUsersList from '../../components/FollowedUsersList/FollowedUsersList';
import SuggestedUsersList from '../../components/SuggestedUsersList/SuggestedUsersList';
import { getFollowing, getSuggestions, followUser, unfollowUser } from '../../services/connectionService';

function ConnectionsPage() {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConnections() {
      try {
        // Use getFollowing() to fetch the list of followed users
        const followingResponse = await getFollowing();
        const suggestionsResponse = await getSuggestions();
        setFollowedUsers(followingResponse.data || []);
        setSuggestedUsers(suggestionsResponse.data || []);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchConnections();
  }, []);

  const handleFollow = async (user) => {
    try {
      await followUser(user.id);
      setFollowedUsers(prev => Array.isArray(prev) ? [...prev, user] : [user]);
      setSuggestedUsers(prev => Array.isArray(prev) ? prev.filter(u => u.id !== user.id) : []);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      await unfollowUser(user.id);
      setFollowedUsers(prev => Array.isArray(prev) ? prev.filter(u => u.id !== user.id) : []);
      setSuggestedUsers(prev => Array.isArray(prev) ? [...prev, user] : [user]);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Connections</Typography>

      <FollowedUsersList
        followedUsers={followedUsers}
        onUnfollow={handleUnfollow}
        onViewProfile={handleViewProfile}
      />

      <SuggestedUsersList
        suggestedUsers={suggestedUsers}
        onFollow={handleFollow}
        onViewProfile={handleViewProfile}
      />
    </Container>
  );
}

export default ConnectionsPage;
// src/pages/UserProfilePage/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Avatar, Button } from '@mui/material';
import { getUserProfileById, followUser, unfollowUser } from '../../services/connectionService';
import { getUserProfile } from '../../services/authService'; // New import to fetch current user

function UserProfilePage() {
  const { id } = useParams();
  const [viewedUser, setViewedUser] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Fetch the profile of the user being viewed (by ID)
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await getUserProfileById(id);
        setViewedUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [id]);

  // Fetch the current logged-in user's profile (to get email) 
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await getUserProfile();
        setCurrentUserEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching current user profile:", error);
      }
    }
    fetchCurrentUser();
  }, []);

  // After both profiles are loaded, determine if the current user is following the viewed user.
  useEffect(() => {
    if (viewedUser && currentUserEmail && viewedUser.followers) {
      setIsFollowing(viewedUser.followers.includes(currentUserEmail));
    }
  }, [viewedUser, currentUserEmail]);

  const handleFollowClick = async () => {
    if (!viewedUser) return;
    setFollowLoading(true);
    try {
      await followUser(viewedUser.id);
      setIsFollowing(true);
      // Optionally update viewedUser.followers if needed:
      setViewedUser(prev => ({
        ...prev,
        followers: [...prev.followers, currentUserEmail]
      }));
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollowClick = async () => {
    if (!viewedUser) return;
    setFollowLoading(true);
    try {
      await unfollowUser(viewedUser.id);
      setIsFollowing(false);
      setViewedUser(prev => ({
        ...prev,
        followers: prev.followers.filter(email => email !== currentUserEmail)
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!viewedUser) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">User not found</Typography>
      </Container>
    );
  }

  // Show the follow/unfollow button only if the current user is not viewing their own profile.
  const showFollowButton = currentUserEmail && (currentUserEmail !== viewedUser.email);

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar src={viewedUser.avatar} alt={viewedUser.name} sx={{ width: 120, height: 120 }} />
        <Typography variant="h4">{viewedUser.name}</Typography>
        <Typography variant="body1">{viewedUser.email}</Typography>
        {/* Add more user details as needed */}
        {showFollowButton && (
          <Box sx={{ mt: 2 }}>
            {followLoading ? (
              <CircularProgress size={24} />
            ) : isFollowing ? (
              <Button variant="outlined" onClick={handleUnfollowClick}>
                Unfollow
              </Button>
            ) : (
              <Button variant="contained" onClick={handleFollowClick}>
                Follow
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default UserProfilePage;
// src/pages/UserProfilePage/UserProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Avatar,
  Button,
} from '@mui/material';
import { getUserProfileById, followUser, unfollowUser } from '../../services/connectionService';

import PostFeed from '../../components/PostFeed/PostFeed';
import { AuthContext } from '../../context/AuthContext';

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const [viewedUser, setViewedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // load the profile we're viewing
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUserProfileById(id);
        if (!mounted) return;
        setViewedUser(res.data);
      } catch (err) {
        console.error('Error fetching viewed user:', err);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // once we know both currentUser and viewedUser, check follow state
  useEffect(() => {
    if (loadingUser || !currentUser || !viewedUser) return;
    setIsFollowing(viewedUser.followers?.includes(currentUser.id));
  }, [loadingUser, currentUser, viewedUser]);

  const handleFollow = async () => {
    if (!viewedUser) return;
    setFollowLoading(true);
    try {
      await followUser(viewedUser.id);
      setIsFollowing(true);
      setViewedUser(u => ({
        ...u,
        followers: [...(u.followers||[]), currentUser.id]
      }));
    } catch (err) {
      console.error('Error following:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!viewedUser) return;
    setFollowLoading(true);
    try {
      await unfollowUser(viewedUser.id);
      setIsFollowing(false);
      setViewedUser(u => ({
        ...u,
        followers: (u.followers||[]).filter(fid => fid !== currentUser.id)
      }));
    } catch (err) {
      console.error('Error unfollowing:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loadingUser) {
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

  const isOwnProfile = currentUser?.id === viewedUser.id;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* PROFILE HEADER */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={viewedUser.avatar}
          alt={viewedUser.name}
          sx={{ width: 120, height: 120 }}
        />
        <Typography variant="h4">{viewedUser.name}</Typography>
        <Typography variant="body1" color="text.secondary">{viewedUser.email}</Typography>

        {/* follow/unfollow */}
        {!isOwnProfile && (
          <Box sx={{ mt: 1 }}>
            {followLoading
              ? <CircularProgress size={24} />
              : isFollowing
                ? <Button variant="outlined" onClick={handleUnfollow}>Unfollow</Button>
                : <Button variant="contained" onClick={handleFollow}>Follow</Button>
            }
          </Box>
        )}
      </Box>

      {/* POSTS FEED */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {isOwnProfile ? 'Your Posts' : `${viewedUser.name}’s Posts`}
        </Typography>
        {/* show all; you can pass limit={...} if you want */}
        <PostFeed
          userId={viewedUser.id}
          onEdit={isOwnProfile ? post => console.log('edit', post) : null}
          onDelete={isOwnProfile ? post => console.log('delete', post) : null}
        />
      </Box>
    </Container>
  );
}

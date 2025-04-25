// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileBanner from '../../components/Profile/ProfileBanner';
import ProfileActions from '../../components/Profile/ProfileActions';
import EditProfileDialog from '../../components/Profile/EditProfileDialog';
import PostFeed from '../../components/PostFeed/PostFeed';
import {
  getUserProfile,
  updateProfile,
  deleteProfile
} from '../../services/authService';
import { deletePost } from '../../services/postService';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load current user profile
  useEffect(() => {
    (async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Edit dialog open/close
  const handleOpenEdit = () => setOpenEditDialog(true);
  const handleCloseEdit = () => setOpenEditDialog(false);

  // Save profile changes
  const handleSaveProfile = async (formData) => {
    try {
      const res = await updateProfile(formData);
      setUser(res.data || res); // adapt to your API shape
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setOpenEditDialog(false);
    }
  };

  // Delete entire profile
  const handleDeleteProfile = async () => {
    try {
      await deleteProfile();
      // clear state/auth and redirect
      navigate('/login');
    } catch (err) {
      console.error('Error deleting profile:', err);
    }
  };

  // When a specific post is edited (you can open an edit dialog here)
  const handleEditPost = (post) => {
    console.log('Edit post:', post);
    // TODO: open your post edit dialog
  };

  // Delete a specific post
  const handleDeletePost = async (post) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(post.id);
      // no need to refetch user, PostFeed will refresh itself because userId hasn't changed
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <p>Error: User not found</p>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Top Banner */}
      <ProfileBanner user={user} />

      {/* Main Container with tighter spacing */}
      <Container sx={{ mt: 2, mx: 4 }}>
        {/* Profile action buttons */}
        <ProfileActions onEdit={handleOpenEdit} onDelete={handleDeleteProfile} />

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          open={openEditDialog}
          handleClose={handleCloseEdit}
          user={user}
          onSave={handleSaveProfile}
          onDelete={handleDeleteProfile}
        />

        {/* User’s own posts feed, with edit & delete handlers */}
        <Box sx={{ mt: 1 }}>
          <PostFeed
            userId={user.id}
            limit={10}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </Box>
      </Container>
    </Box>
  );
}

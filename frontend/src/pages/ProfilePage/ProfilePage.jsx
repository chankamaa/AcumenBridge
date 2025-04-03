// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import ProfileBanner from '../../components/Profile/ProfileBanner';
import ProfileActions from '../../components/Profile/ProfileActions';
import EditProfileDialog from '../../components/Profile/EditProfileDialog';
import { getUserProfile, updateProfile } from '../../services/authService';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenEdit = () => setOpenEditDialog(true);
  const handleCloseEdit = () => setOpenEditDialog(false);

  const handleSaveProfile = async (formData) => {
    try {
      // Call updateProfile API with FormData and update the user state with the new data.
      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setOpenEditDialog(false);
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
      <ProfileBanner user={user} />
      <Container sx={{ mt: 4, mx: 8 }}>
        <ProfileActions onEdit={handleOpenEdit} />
      </Container>
      <EditProfileDialog
        open={openEditDialog}
        handleClose={handleCloseEdit}
        user={user}
        onSave={handleSaveProfile}
      />
    </Box>
  );
}

export default ProfilePage;

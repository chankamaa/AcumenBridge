// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import ProfileBanner from '../../components/Profile/ProfileBanner';
import ProfileActions from '../../components/Profile/ProfileActions';
import EditProfileDialog from '../../components/Profile/EditProfileDialog';

function ProfilePage() {
  // Example user data
  const user = {
    name: 'Chankama Gunasekara',
    email: 't1@chankama.me',
    avatar: 'https://via.placeholder.com/80',
    subtitle: 'Attended nalanda college',
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleOpenEdit = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
  };

  const handleSaveProfile = (updatedData) => {
    console.log('Updated Profile:', updatedData);
    // TODO: Call your API to update the user profile, then update state if needed
    setOpenEditDialog(false);
  };

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
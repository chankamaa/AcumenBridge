// src/components/Profile/ProfileActions.jsx
import React from 'react';
import { Box, Button } from '@mui/material';

function ProfileActions({ onEdit }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        mx: 8, // Horizontal margin
        mt: 4, // Top margin
      }}
    >
      <Button variant="outlined" onClick={onEdit}>
        Edit profile
      </Button>
      <Button variant="outlined">
        Connections
      </Button>
    </Box>
  );
}

export default ProfileActions;
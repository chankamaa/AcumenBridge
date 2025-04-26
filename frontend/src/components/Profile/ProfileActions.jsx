// src/components/Profile/ProfileActions.jsx
import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProfileActions({ onEdit }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        mx: 8,
        mt: 4,
      }}
    >
      <Button variant="outlined" onClick={onEdit}>
        Edit profile
      </Button>
      <Button variant="outlined" onClick={() => navigate('/connections')}>
        Connections
      </Button>
    </Box>
  );
}

export default ProfileActions;
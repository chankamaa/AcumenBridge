// src/components/ProfileBanner.jsx
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

function ProfileBanner({ user }) {
  return (
    <Box sx={{ position: 'relative', mx: 12 }}> {/* Increased horizontal margin */}
      {/* Banner background */}
      <Box
        sx={{
          height: 200, // increased banner height
          backgroundColor: '#DCE6F1', // Example background color
        }}
      />
      {/* Avatar + Name container */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: 120, // adjusted top value for taller banner
          left: 24,
        }}
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          sx={{ width: 80, height: 80, border: '2px solid white' }}
        />
        <Box sx={{ marginLeft: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileBanner;
// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PostFeed from '../../components/PostFeed/PostFeed';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) localStorage.setItem('token', token);
  }, [location]);

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        px: 2,
        pt: 1,
        pb: 0,        // no bottom padding
        gap: 2,
      }}
    >
      {/* Left Column */}
      <Box sx={{ flexBasis: '25%', maxWidth: 300 }}>
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            position: 'sticky',
            top: 16,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            What’s on your mind?
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate('/create-post')}
          >
            Create Post
          </Button>
        </Paper>
      </Box>

      {/* Center Feed */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          height: '100%',
          pt: 0,      // no top padding
          pb: 0,      // no bottom padding
        }}
      >
        <PostFeed limit={20} onEdit={null} onDelete={null} />
      </Box>

      {/* Right Placeholder */}
      <Box sx={{ flexBasis: '25%', maxWidth: 200 }} />
    </Box>
  );
}

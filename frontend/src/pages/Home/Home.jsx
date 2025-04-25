// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PostFeed from '../../components/PostFeed/PostFeed';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // grab token from URL once
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) localStorage.setItem('token', token);
  }, [location]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2, px: 1 }}>
      {/* sticky Create Post button */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
          py: 1,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/create-post')}
        >
          Create Post
        </Button>
      </Box>

      {/* only posts by people you follow (your own are filtered out) */}
      <PostFeed
        limit={20}
        onEdit={null}
        onDelete={null}
      />
    </Box>
  );
}

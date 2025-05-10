// src/components/PostFeed.jsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { getFeed, getPostsByUser } from '../../services/postService';
import PostCard from '../Post/PostCard';

export default function PostFeed({ userId, limit, onEdit, onDelete }) {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);


  const displayPosts = typeof limit === 'number'
    ? posts.slice(0, limit)
    : posts;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 0.5, px: 1 }}>
      {/* Optional Refresh button */}
      {!userId && (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
          py: 0.5,
          mb: 0.5
        }}>
          {/* <Button variant="contained" fullWidth onClick={() => window.location.reload()}>
            Refresh Feed
          </Button> */}
        </Box>
      )}

      {/* Scrollable feed */}
      <Box sx={{ maxHeight: '100vh', overflowY: 'auto', mt: 0 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 0.5 }}>
            <CircularProgress size={24} />
          </Box>
        ) : displayPosts.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ mt: 1 }}>
            No posts yet.
          </Typography>
        ) : (
          displayPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={()   => onEdit && onEdit(post)}
              onDelete={() => onDelete && onDelete(post)}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

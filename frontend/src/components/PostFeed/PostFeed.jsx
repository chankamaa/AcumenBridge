// src/components/PostFeed.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import PostCard from '../Post/PostCard';
import { getFeed } from '../../services/postService';
import { AuthContext } from '../../context/AuthContext';

export default function PostFeed({ limit, onEdit, onDelete }) {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getFeed();
        setPosts(res.data);
      } catch (err) {
        console.error('Error loading feed:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // filter out your own posts
  const filtered = posts.filter(p => p.userId !== user?.id);
  const displayPosts = typeof limit === 'number' 
    ? filtered.slice(0, limit) 
    : filtered;

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!displayPosts.length) {
    return (
      <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
        No posts yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {displayPosts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={() => onEdit?.(post)}
          onDelete={() => onDelete?.(post)}
        />
      ))}
    </Box>
  );
}

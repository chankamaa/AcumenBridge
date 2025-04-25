// src/pages/CreatePost/CreatePostPage.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Grid, Box, CircularProgress } from '@mui/material';
import { createPost } from '../../services/postService';  // ← import your service

export default function CreatePostPage() {
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const openWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dffkhchiw',
        uploadPreset: 'nnccvv',
        maxFiles: 3,
        resourceType: 'auto',
        multiple: true,
        clientAllowedFormats: ['jpg', 'png', 'mp4'],
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          setMediaUrls(prev => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mediaUrls.length === 0) {
      alert('Please upload at least 1 media file.');
      return;
    }
    setLoading(true);
    try {
      await createPost({ description, mediaUrls });
      setDescription('');
      setMediaUrls([]);
      alert('Post created successfully!');
    } catch (err) {
      console.error('Create post failed:', err);
      alert('Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-3xl mx-auto mt-12 px-4">
      <Paper elevation={3} className="p-6 rounded-xl">
        <Typography variant="h5" gutterBottom>
          Create a New Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="What's on your mind?"
            variant="outlined"
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ mb: 4 }}
          />
          <Button
            variant="outlined"
            onClick={openWidget}
            sx={{ mb: 4 }}
          >
            Upload Image / Video
          </Button>
          {mediaUrls.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {mediaUrls.map((url, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '100%', // 1:1 aspect
                      overflow: 'hidden',
                      borderRadius: 2,
                      border: '1px solid #ddd'
                    }}
                  >
                    {/\.(mp4|webm)$/i.test(url) ? (
                      <video
                        src={url}
                        controls
                        style={{
                          position: 'absolute',
                          top: 0, left: 0,
                          width: '100%', height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <img
                        src={url}
                        alt=""
                        style={{
                          position: 'absolute',
                          top: 0, left: 0,
                          width: '100%', height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

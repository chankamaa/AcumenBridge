import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Grid } from '@mui/material';

const CreatePostPage = () => {
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);

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
          setMediaUrls((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mediaUrls.length === 0) {
      alert('Please upload at least 1 media file.');
      return;
    }

    const newPost = {
      description,
      mediaUrls,
    };

    console.log('Sending to backend:', newPost);
    // TODO: Send to backend

    setDescription('');
    setMediaUrls([]);
    alert('Post created successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <Paper elevation={3} className="p-6 rounded-xl">
        <Typography variant="h5" gutterBottom className="font-bold text-gray-800">
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
            onChange={(e) => setDescription(e.target.value)}
            className="mb-6"
          />

          <Button
            variant="outlined"
            color="primary"
            onClick={openWidget}
            className="mb-4"
            startIcon={<span>📎</span>}
          >
            Upload Image / Video
          </Button>

          {mediaUrls.length > 0 && (
            <Grid container spacing={2} className="mb-6">
              {mediaUrls.map((url, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg border border-gray-200">
                    {url.includes('.mp4') ? (
                      <video
                        controls
                        src={url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`media-${index}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 font-semibold rounded-lg shadow"
          >
            Post
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default CreatePostPage;
// src/components/Post/EditPostDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Button, Stack
} from '@mui/material';
import { updatePost } from '../../services/postService';

export default function EditPostDialog({ post, open, onClose, onSaved }) {
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) setDescription(post.description || '');
  }, [post]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updatePost(post.id, { description, mediaUrls: post.mediaUrls });
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt:1 }}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          {/* if you want to re-upload media, add it here */}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

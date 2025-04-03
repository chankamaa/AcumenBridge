// src/components/EditProfileDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';

function EditProfileDialog({ open, handleClose, user, onSave }) {
  // Local state for editable fields
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Initialize state when dialog opens
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarPreview(user.avatar || '');
      setBannerPreview(user.banner || '');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  }, [user, open]);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // If either newPassword or confirmPassword is provided, require both and verify
    if (newPassword !== '' || confirmPassword !== '') {
      if (newPassword !== confirmPassword) {
        setPasswordError("New password and confirmation do not match.");
        return;
      }
      if (oldPassword === '') {
        setPasswordError("Please enter your old password to change your password.");
        return;
      }
    }
    
    // Create FormData to send text fields and files
    const formData = new FormData();
    formData.append("name", name);
    // Append password fields only if a new password is provided
    if (newPassword !== '') {
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
    }
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (bannerFile) {
      formData.append("banner", bannerFile);
    }

    onSave(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={user?.email || ''}
            InputProps={{ readOnly: true }}
          />
          {/* Password Change Fields */}
          <TextField
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && (
            <Box sx={{ color: 'red', fontSize: '0.8rem' }}>{passwordError}</Box>
          )}
          {/* File Upload for Avatar and Banner */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button variant="outlined" component="label">
              Upload Avatar
              <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
            </Button>
            <Button variant="outlined" component="label">
              Upload Banner
              <input type="file" hidden accept="image/*" onChange={handleBannerUpload} />
            </Button>
          </Box>
          {/* Preview Section */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            {avatarPreview ? (
              <Avatar src={avatarPreview} alt={name} sx={{ width: 56, height: 56 }} />
            ) : (
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#eee',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  No Avatar
                </Typography>
              </Box>
            )}
            {bannerPreview && (
              <Box
                component="img"
                src={bannerPreview}
                alt="Banner Preview"
                sx={{
                  height: 100, // Increased height for banner preview
                  width: 'auto',
                  borderRadius: 1,
                  border: '1px solid #ccc',
                }}
              />
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProfileDialog;

// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { forgotPassword } from '../../services/authService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgot = async () => {
    setMessage('');
    setError('');
    // Validate that the email field is not empty
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    try {
      await forgotPassword(email);
      setMessage('Password reset link sent to your email.');
    } catch (err) {
      // If the backend returns an error (e.g. if the email is not found), show the error message.
      setError(err.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        margin: 'auto',
        marginTop: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" textAlign="center">
        Forgot Password
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleForgot}>
        Send Reset Link
      </Button>
      {message && (
        <Typography color="primary" textAlign="center">
          {message}
        </Typography>
      )}
      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default ForgotPassword;
// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { forgotPassword } from '../../services/authService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgot = async () => {
    try {
      await forgotPassword(email);
      setMessage('Password reset link sent to your email.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending reset link');
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
        gap: 2
      }}
    >
      <Typography variant="h4" textAlign="center">Forgot Password</Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" onClick={handleForgot}>
        Send Reset Link
      </Button>

      {message && (
        <Typography color="secondary" textAlign="center">
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default ForgotPassword;
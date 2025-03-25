// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, LinearProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../../services/authService';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  const evaluatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(evaluatePasswordStrength(val));
  };

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      await resetPassword(token, password);
      setMessage('Password reset successful! You can now log in.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error resetting password');
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
      <Typography variant="h4" textAlign="center">Reset Password</Typography>

      <TextField
        label="New Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={handlePasswordChange}
      />
      <LinearProgress
        variant="determinate"
        value={(strength / 4) * 100}
        sx={{ height: 8 }}
      />

      <TextField
        label="Confirm New Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button variant="contained" onClick={handleReset}>
        Reset Password
      </Button>

      {message && (
        <Typography color="secondary" textAlign="center">
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default ResetPassword;
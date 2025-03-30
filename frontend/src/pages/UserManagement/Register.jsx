// src/pages/Register.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, LinearProgress } from '@mui/material';
import { registerUser, sendOtp, verifyOtp } from '../../services/authService';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  // Basic password strength logic
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

  // Send OTP endpoint: verifies that email is entered first.
  const handleSendOtp = async () => {
    if (!email) {
      setMessage('Please enter your email before sending OTP.');
      return;
    }
    try {
      await sendOtp(email);
      setOtpSent(true);
      setMessage('OTP sent to your email. Check your inbox.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending OTP');
    }
  };

  // Verify OTP endpoint
  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setMessage('OTP must be at least 6 digits.');
      return;
    }
    try {
      await verifyOtp(email, otp);
      setIsVerified(true);
      setMessage('Email verified successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid OTP');
    }
  };

  // Register endpoint; only allow registration if OTP is verified and passwords match.
  const handleRegister = async () => {
    if (!isVerified) {
      setMessage('Please verify your email first with the OTP.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      await registerUser({ name, email, password, confirmPassword });
      setMessage('Registration successful! You can now log in.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
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
      <Typography variant="h4" textAlign="center">Register</Typography>

      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Box display="flex" gap={1}>
        <TextField
          label="OTP"
          variant="outlined"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={isVerified}
        />
        <Button
          variant="contained"
          onClick={handleSendOtp}
          disabled={otpSent || isVerified}
        >
          {otpSent ? "OTP Sent" : "Send OTP"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleVerifyOtp}
          disabled={!otpSent || isVerified}
        >
          Verify OTP
        </Button>
      </Box>

      <TextField
        label="Password"
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
        label="Confirm Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button variant="contained" onClick={handleRegister}>
        Register
      </Button>

      {message && (
        <Typography color="secondary" textAlign="center">
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default Register;
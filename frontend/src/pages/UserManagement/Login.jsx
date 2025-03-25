// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser, socialLogin } from '../../services/authService';

// Logo Imports (adjust paths as needed)
import GoogleLogo from '../../assets/google-logo.svg';
import FacebookLogo from '../../assets/facebook-logo.svg';
import GitHubLogo from '../../assets/github-logo.svg';

function Login() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });
      // On success, redirect or set global auth state
      navigate('/'); // or any other route
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSocialLogin = (provider) => {
    // This should redirect to your backend’s OAuth2 endpoint
    socialLogin(provider);
  };

  return (
    <Box
      sx={{
        width: '400px',
        margin: '5rem auto',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={1}>
        Welcome Back!
      </Typography>
      <Typography variant="body1" textAlign="center" mb={2} color="text.secondary">
        Please log in to continue
      </Typography>

      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={handleLogin}
        sx={{ textTransform: 'none', fontWeight: 'bold' }}
      >
        Login
      </Button>

      {message && (
        <Typography color="error" textAlign="center" mt={1}>
          {message}
        </Typography>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          variant="text"
          onClick={() => navigate('/forgot-password')}
          sx={{ textTransform: 'none' }}
        >
          Forgot Password?
        </Button>
        <Button
          variant="text"
          onClick={() => navigate('/register')}
          sx={{ textTransform: 'none' }}
        >
          Register
        </Button>
      </Box>

      <Divider sx={{ my: 2 }}>OR</Divider>

      <Button
        variant="contained"
        onClick={() => handleSocialLogin('google')}
        startIcon={
          <img
            src={GoogleLogo}
            alt="Google"
            style={{ width: 24, height: 24 }}
          />
        }
        sx={{
          backgroundColor: '#fff',
          color: '#555',
          border: '1px solid #ddd',
          textTransform: 'none',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        Continue with Google
      </Button>

      <Button
        variant="contained"
        onClick={() => handleSocialLogin('facebook')}
        startIcon={
          <img
            src={FacebookLogo}
            alt="Facebook"
            style={{ width: 24, height: 24 }}
          />
        }
        sx={{
            backgroundColor: '#fff',
            color: '#555',
            border: '1px solid #ddd',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
        }}
      >
        Continue with Facebook
      </Button>

      <Button
        variant="contained"
        onClick={() => handleSocialLogin('github')}
        startIcon={
          <img
            src={GitHubLogo}
            alt="GitHub"
            style={{ width: 24, height: 24 }}
          />
        }
        sx={{
            backgroundColor: '#fff',
            color: '#555',
            border: '1px solid #ddd',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
        }}
      >
        Continue with GitHub
      </Button>
    </Box>
  );
}

export default Login;
// src/components/NavigationBar/NavigationBar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Import your logo PNG
import LogoImage from '../../assets/logo-acumennbridge.png';
// Import logoutUser from authService
import { logoutUser } from '../../services/authService';

function NavigationBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Replace this with real user data from context or global state when available.
  const [user, ] = useState({
    name: 'Chankama Gunasekara',
    avatar: '', // Empty means no avatar uploaded
    subtitle: 'Attended Nalanda College',
  });

  // You can later load user data from your backend (for example, via getUserProfile)
  // useEffect(() => { ... fetch and setUser ... }, []);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleUserMenuClose();
    navigate('/settings');
  };

  const handleSignOut = async () => {
    handleUserMenuClose();
    // Call logout function to clear token and invalidate session on backend
    await logoutUser();
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleLogoClick}
        >
          <Box
            component="img"
            src={LogoImage}
            alt="Acumenbridge Logo"
            sx={{ width: 80, marginRight: 1 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Acumenbridge
          </Typography>
        </Box>

        {/* Center: Search Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right: Navigation Links and User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Nav Links */}
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}
          >
            Home
          </Button>
          <IconButton
            color="inherit"
            component={Link}
            to="/notifications"
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          >
            <NotificationsIcon />
          </IconButton>

          {/* User Avatar */}
          <IconButton onClick={handleUserMenuOpen} color="inherit">
            {user.avatar ? (
              <Avatar src={user.avatar} alt={user.name} />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 40 }} />
            )}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Dropdown Menu for User Profile */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{ sx: { width: 240 } }}
      >
        {/* Top Section: Avatar, Name, Subtitle */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          {user.avatar ? (
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 48, height: 48, mr: 2 }} />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 48, mr: 2, color: '#888' }} />
          )}
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.subtitle}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleViewProfile}>View profile</MenuItem>
        <MenuItem onClick={handleSettings}>Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </Menu>
    </AppBar>
  );
}

export default NavigationBar;
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

// Import your logo PNG
import LogoImage from '../../assets/logo-acumennbridge.png';

function NavigationBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // Example user data; in a real app, retrieve this from context or props
  const user = {
    name: 'Chankama Gunasekara',
    avatar: 'https://via.placeholder.com/40',
    subtitle: 'Attended Nalanda College',
  };

  const handleViewProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleUserMenuClose();
    navigate('/settings');
  };

  const handleSignOut = () => {
    handleUserMenuClose();
    // Perform logout logic here, then:
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
            <Avatar src={user.avatar} alt={user.name} />
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
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 48, height: 48, mr: 2 }} />
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
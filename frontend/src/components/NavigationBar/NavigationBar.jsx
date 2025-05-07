// src/components/NavigationBar/NavigationBar.jsx
import React, { useState, useEffect, useContext } from 'react';
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
import LogoImage from '../../assets/logo-acumennbridge.png';
import { getUserProfile, logoutUser } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

function NavigationBar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user profile when component mounts or when the user state changes.
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getUserProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    }
    if (!user) {
      fetchUser();
    }
  }, [setUser, user]);

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


  const handleProgress = () => {
    handleUserMenuClose();
    navigate('/progress');

  const handleLearningPlans = () => {
    handleUserMenuClose();
    navigate('/learning-plans');
  };

  const handleSettings = () => {
    handleUserMenuClose();
    navigate('/settings');
  };

  const handleSignOut = async () => {
    handleUserMenuClose();
    await logoutUser();
    setUser(null);
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: '#fff', color: '#000', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
          <Box component="img" src={LogoImage} alt="Acumenbridge Logo" sx={{ width: 80, marginRight: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Acumenbridge</Typography>
        </Box>

        {/* Center: Search Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right: Conditional Rendering */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{ textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/community/progress"
                sx={{ textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}
              >
                Community Achievements
                
                to="/community/plans"
                sx={{ textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}
              >
                Browse Learning Plans
              </Button>
              <IconButton
                color="inherit"
                component={Link}
                to="/notifications"
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                <NotificationsIcon />
              </IconButton>
              <IconButton onClick={handleUserMenuOpen} color="inherit">
                {user.avatar ? (
                  <Avatar src={user.avatar} alt={user.name} />
                ) : (
                  <AccountCircleIcon sx={{ fontSize: 40 }} />
                )}
              </IconButton>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Dropdown Menu for User Profile */}
      {user && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{ sx: { width: 240 } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            {user.avatar ? (
              <Avatar src={user.avatar} alt={user.name} sx={{ width: 48, height: 48, mr: 2 }} />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 48, mr: 2, color: '#888' }} />
            )}
            <Box>
              <Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.subtitle}</Typography>
            </Box>
          </Box>
          <Divider />
          <MenuItem onClick={handleViewProfile}>View profile</MenuItem>
          <MenuItem onClick={handleProgress}>My Achievements</MenuItem>
          <MenuItem onClick={handleLearningPlans}>My Learning Plans</MenuItem>
          <MenuItem onClick={handleSettings}>Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </Menu>
      )}
    </AppBar>
  );
}

export default NavigationBar;
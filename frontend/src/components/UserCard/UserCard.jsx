// src/components/UserCard.jsx
import React from 'react';
import { Card, CardContent, CardActions, Avatar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserCard({ user, isFollowed, onFollowToggle }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Navigate to the user's profile page (assuming user.id exists)
    navigate(`/profile/${user.id}`);
  };

  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardContent onClick={handleProfileClick} sx={{ cursor: 'pointer' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user.avatar} alt={user.name} />
          <Typography variant="h6">{user.name}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={() => onFollowToggle(user)}>
          {isFollowed ? 'Unfollow' : 'Follow'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default UserCard;
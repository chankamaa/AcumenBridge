// src/components/SuggestedUsersList.jsx
import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import UserCard from '../UserCard/UserCard';

function SuggestedUsersList({ suggestedUsers, onFollow, onViewProfile }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Suggested Users
      </Typography>
      {suggestedUsers && suggestedUsers.length > 0 ? (
        <Grid container spacing={2}>
          {suggestedUsers.map((user) => (
            <Grid item key={user.id} xs={12} sm={6} md={4}>
              <UserCard 
                user={user} 
                isFollowed={false} 
                onFollowToggle={() => onFollow(user)}
                onViewProfile={() => onViewProfile(user.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No suggested users available at the moment.
        </Typography>
      )}
    </Box>
  );
}

export default SuggestedUsersList;
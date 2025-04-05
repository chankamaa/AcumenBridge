// src/components/SuggestedUsersList.jsx
import React from 'react';
import { Typography, Grid } from '@mui/material';
import UserCard from '../UserCard/UserCard';

function SuggestedUsersList({ suggestedUsers, onFollow }) {
  return (
    <>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Suggested Users</Typography>
      <Grid container spacing={2}>
        {suggestedUsers.map(user => (
          <Grid item key={user.id} xs={12} sm={6} md={4}>
            <UserCard user={user} isFollowed={false} onFollowToggle={onFollow} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default SuggestedUsersList;
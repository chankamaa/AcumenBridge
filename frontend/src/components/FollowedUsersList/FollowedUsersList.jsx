// src/components/FollowedUsersList.jsx
import React from 'react';
import { Typography, Grid } from '@mui/material';
import UserCard from '../UserCard/UserCard';

function FollowedUsersList({ followedUsers, onUnfollow }) {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>Following</Typography>
      <Grid container spacing={2}>
        {followedUsers.map(user => (
          <Grid item key={user.id} xs={12} sm={6} md={4}>
            <UserCard user={user} isFollowed={true} onFollowToggle={onUnfollow} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default FollowedUsersList;
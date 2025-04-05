// src/components/FollowedUsersList.jsx
import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import UserCard from '../UserCard/UserCard';

function FollowedUsersList({ followedUsers, onUnfollow, onViewProfile }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Following</Typography>
      {followedUsers && followedUsers.length > 0 ? (
        <Grid container spacing={2}>
          {followedUsers.map((user) => (
            <Grid item key={user.id} xs={12} sm={6} md={4}>
              <UserCard
                user={user}
                isFollowed={true}
                onFollowToggle={() => onUnfollow(user)}
                onViewProfile={() => onViewProfile(user.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          You are not following anyone yet.
        </Typography>
      )}
    </Box>
  );
}

export default FollowedUsersList;
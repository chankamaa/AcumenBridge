// src/pages/ConnectionsPage.jsx
import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import FollowedUsersList from '../../components/FollowedUsersList/FollowedUsersList';
import SuggestedUsersList from '../../components/SuggestedUsersList/SuggestedUsersList';

// Sample data; in a real app, fetch these from your backend
const sampleFollowedUsers = [
  { id: '1', name: 'Alice Smith', avatar: 'https://via.placeholder.com/80' },
  { id: '2', name: 'Bob Johnson', avatar: 'https://via.placeholder.com/80' },
];

const sampleSuggestedUsers = [
  { id: '3', name: 'Charlie Brown', avatar: 'https://via.placeholder.com/80' },
  { id: '4', name: 'Diana Prince', avatar: 'https://via.placeholder.com/80' },
];

function ConnectionsPage() {
  const [followedUsers, setFollowedUsers] = useState(sampleFollowedUsers);
  const [suggestedUsers, setSuggestedUsers] = useState(sampleSuggestedUsers);

  // Example handlers for follow/unfollow toggles
  const handleUnfollow = (user) => {
    // Remove user from followed list and add back to suggestions
    setFollowedUsers(prev => prev.filter(u => u.id !== user.id));
    setSuggestedUsers(prev => [...prev, user]);
  };

  const handleFollow = (user) => {
    // Remove user from suggestions and add to followed list
    setSuggestedUsers(prev => prev.filter(u => u.id !== user.id));
    setFollowedUsers(prev => [...prev, user]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box>
        <FollowedUsersList followedUsers={followedUsers} onUnfollow={handleUnfollow} />
        <SuggestedUsersList suggestedUsers={suggestedUsers} onFollow={handleFollow} />
      </Box>
    </Container>
  );
}

export default ConnectionsPage;
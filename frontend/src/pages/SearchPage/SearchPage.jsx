import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Grid } from '@mui/material';
import { searchUsers } from '../../services/connectionService';
import UserCard from '../../components/UserCard/UserCard';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        const response = await searchUsers(query);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    }
    if (query) {
      fetchSearchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Results for "{query}"
      </Typography>
      {results.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {results.map(user => (
            <Grid item key={user.id} xs={12} sm={6} md={4}>
              <UserCard user={user} isFollowed={false} onFollowToggle={() => {}} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default SearchPage;
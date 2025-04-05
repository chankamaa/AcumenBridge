// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CreatePostPage from '../CreatePost/CreatePostPage';

function Home() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [location]);

  return (
    <CreatePostPage />
  );
}

export default Home;
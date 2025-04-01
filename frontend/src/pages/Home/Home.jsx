// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [location]);

  return <div>Welcome Home!</div>;
}

export default Home;
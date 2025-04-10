import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [location]);

  const handleCreatePost = () => {
    navigate('/create-post');

  };
  const handleHomePage = () => {
    navigate('/Homepage');
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome Home!</h1>
        <p className="home-subtitle">Ready to share something new?</p>
        <button onClick={handleCreatePost} className="home-button">
          Create Post
        </button>
        <button onClick={handleHomePage} className="home-button">
          Home Page
        </button>
      </div>
    </div>
  );
}

export default Home;
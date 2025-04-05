// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/UserManagement/Login';
import Register from './pages/UserManagement/Register';
import ForgotPassword from './pages/UserManagement/ForgotPassword';
import ResetPassword from './pages/UserManagement/ResetPassword';
import NavigationBar from './components/NavigationBar/NavigationBar';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Home from './pages/Home/Home';
import CreatePostPage from './pages/CreatePost/CreatePostPage';


function App() {
  return (
    <>
      <Router>
      <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-post" element={<CreatePostPage/>} />
          <Route path="/create-post/" element={<CreatePostPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
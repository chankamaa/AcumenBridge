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
import ConnectionsPage from './pages/ConnectionsPage/ConnectionsPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import SearchPage from './pages/SearchPage/SearchPage';
import LearningPlans from './pages/LearningPlans/LearningPlans';
import AllUsersLearningPlans from './pages/LearningPlans/AllUsersLearningPlans';

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
          <Route path='/connections' element={<ConnectionsPage />} />
          <Route path="/profile/:id" element={<UserProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/learning-plans" element={<LearningPlans />} />
          <Route path="/community/plans" element={<AllUsersLearningPlans />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
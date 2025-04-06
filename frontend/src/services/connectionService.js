// src/services/connectionService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper function to set the authorization header using JWT token (if available)
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getFollowing() {
  return axios.get(`${API_URL}/auth/following`, {
    withCredentials: true,
    headers: authHeaders()
  });
}

export async function getSuggestions() {
  return axios.get(`${API_URL}/auth/suggestions`, {
    withCredentials: true,
    headers: authHeaders()
  });
}

// Follow a user by their ID
export async function followUser(targetUserId) {
  return axios.post(`${API_URL}/auth/follow/${targetUserId}`, {}, {
    withCredentials: true,
    headers: authHeaders()
  });
}

// Unfollow a user by their ID
export async function unfollowUser(targetUserId) {
  return axios.post(`${API_URL}/auth/unfollow/${targetUserId}`, {}, {
    withCredentials: true,
    headers: authHeaders()
  });
}

// NEW: Get a user's profile by their ID (for public profile viewing)
export async function getUserProfileById(userId) {
  return axios.get(`${API_URL}/auth/profile/${userId}`, {
    withCredentials: true,
    headers: authHeaders()
  });
}

export async function searchUsers(query) {
    return axios.get(`${API_URL}/auth/search?query=${encodeURIComponent(query)}`, {
      withCredentials: true,
      headers: authHeaders()
    });
  }
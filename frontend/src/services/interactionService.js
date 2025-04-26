// src/services/interactionService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// helper to include auth header if logged in
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

//
// —— Post Likes ——
//

// Like a post
export function likePost(postId) {
  return axios.post(
    `${API_URL}/posts/${postId}/likes`,
    null,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

// Unlike a post
export function unlikePost(postId) {
  return axios.delete(
    `${API_URL}/posts/${postId}/likes`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

//
// —— Comments ——
//

// Fetch comments for a given post
export function getCommentsByPost(postId) {
  return axios.get(
    `${API_URL}/posts/${postId}/comments`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

// Add a new comment to a post
export function addComment(postId, text) {
  return axios.post(
    `${API_URL}/comments`,
    { postId, text },
    {
      withCredentials: true,
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'
      }
    }
  );
}

// Edit an existing comment
export function updateComment(commentId, text) {
  return axios.put(
    `${API_URL}/comments/${commentId}`,
    { text },
    {
      withCredentials: true,
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'
      }
    }
  );
}

// Delete a comment
export function deleteComment(commentId) {
  return axios.delete(
    `${API_URL}/comments/${commentId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

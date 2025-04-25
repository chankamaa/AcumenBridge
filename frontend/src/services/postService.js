import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// helper to include auth header if logged in
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createPost(postData) {
  // postData can be FormData (if you ever attach files)
  return axios.post(
    `${API_URL}/posts`,
    postData,
    {
      withCredentials: true,
      headers: {
        ...authHeaders(),
        // if sending JSON instead, uncomment:
        // 'Content-Type': 'application/json'
      }
    }
  );
}

export async function getFeed() {
  return axios.get(
    `${API_URL}/posts`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

export async function getPostsByUser(userId) {
  return axios.get(
    `${API_URL}/posts/user/${userId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

export async function getPostById(postId) {
  return axios.get(
    `${API_URL}/posts/${postId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

export async function updatePost(postId, updateData) {
  return axios.put(
    `${API_URL}/posts/${postId}`,
    updateData,
    {
      withCredentials: true,
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'
      }
    }
  );
}

export async function deletePost(postId) {
  return axios.delete(
    `${API_URL}/posts/${postId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

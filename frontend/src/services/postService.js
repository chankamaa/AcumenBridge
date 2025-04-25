import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// All Posts
export const fetchAllPosts = async () => (await API.get('/posts')).data;

// Like
export const likePost = async (postId) => (await API.post(`/posts/${postId}/like`)).data;

// Comment
export const commentOnPost = async (postId, comment) =>
  (await API.post(`/posts/${postId}/comments`, { text: comment })).data;

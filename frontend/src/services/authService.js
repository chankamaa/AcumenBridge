// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function registerUser(userData) {
  // userData = { name, email, password, confirmPassword }
  return axios.post(`${API_URL}/auth/register`, userData, { withCredentials: true });
}

export async function sendOtp(email) {
  return axios.post(`${API_URL}/auth/send-otp`, { email }, { withCredentials: true });
}

export async function verifyOtp(email, otp) {
  return axios.post(`${API_URL}/auth/verify-otp`, { email, otp }, { withCredentials: true });
}

export async function loginUser(credentials) {
  const response = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true });
  // If manual login returns a JWT token, store it in localStorage for future requests
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
}

export async function socialLogin(provider) {
  // For social login, your backend handles session creation via OAuth2.
  window.location.href = `${API_URL}/oauth2/authorization/${provider}`;
}

export async function forgotPassword(email) {
  return axios.post(`${API_URL}/auth/forgot-password`, { email }, { withCredentials: true });
}

export async function resetPassword(token, newPassword) {
  return axios.post(`${API_URL}/auth/reset-password`, { token, newPassword }, { withCredentials: true });
}

export async function getUserProfile() {
  const token = localStorage.getItem('token');
  // Conditionally include the Authorization header if token exists
  return axios.get(`${API_URL}/auth/profile`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function logoutUser() {
  try {
    // Call the backend logout endpoint to invalidate the session
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem('token');
  }
}
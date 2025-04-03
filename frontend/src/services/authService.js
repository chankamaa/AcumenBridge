// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function registerUser(userData) {
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
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
}

export async function socialLogin(provider) {
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
  return axios.get(`${API_URL}/auth/profile`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// Add and export the updateProfile function
export async function updateProfile(formData) {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${API_URL}/auth/update-profile`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem('token');
  }
}

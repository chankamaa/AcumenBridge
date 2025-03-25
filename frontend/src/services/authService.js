// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function registerUser(userData) {
  // userData = { name, email, password, confirmPassword }
  return axios.post(`${API_URL}/auth/register`, userData);
}

export async function sendOtp(email) {
  // Endpoint to trigger sending an OTP to the given email
  return axios.post(`${API_URL}/auth/send-otp`, { email });
}

export async function verifyOtp(email, otp) {
  return axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
}

export async function loginUser(credentials) {
  // credentials = { email, password }
  return axios.post(`${API_URL}/auth/login`, credentials);
}

export async function socialLogin(provider) {
    // Directly redirect to the Spring Boot OAuth2 endpoint
    window.location.href = `${API_URL}/oauth2/authorization/${provider}`;
  }

export async function forgotPassword(email) {
  return axios.post(`${API_URL}/auth/forgot-password`, { email });
}

export async function resetPassword(token, newPassword) {
  return axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
}
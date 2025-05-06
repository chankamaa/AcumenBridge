import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const ProgressService = {
  async createProgress(progressData) {
    if (!progressData.template) {
      progressData.template = 'default';
    }
    return axios.post(`${API_URL}/api/progress`, progressData, {
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'
      }
    });
  },

  async getAllProgress() {
    return axios.get(`${API_URL}/api/progress`, {
      headers: authHeaders()
    });
  },

  async getAllPublicProgress() {
    return axios.get(`${API_URL}/api/progress/public`, {
      headers: authHeaders()
    });
  },

  async getProgressById(id) {
    return axios.get(`${API_URL}/api/progress/${id}`, {
      headers: authHeaders()
    });
  },

  async updateProgress(id, updateData) {
    return axios.put(`${API_URL}/api/progress/${id}`, updateData, {
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'
      }
    });
  },

  async deleteProgress(id) {
    return axios.delete(`${API_URL}/api/progress/${id}`, {
      headers: authHeaders()
    });
  },

  // New like functionality
  async toggleLike(progressId) {
    return axios.put(`${API_URL}/api/progress/${progressId}/like`, {}, {
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'
      }
    });
  },

  async getLikes(progressId) {
    return axios.get(`${API_URL}/api/progress/${progressId}/likes`, {
      headers: authHeaders()
    });
  },

  async checkIfLiked(progressId) {
    return axios.get(`${API_URL}/api/progress/${progressId}/liked`, {
      headers: authHeaders()
    });
  }
};
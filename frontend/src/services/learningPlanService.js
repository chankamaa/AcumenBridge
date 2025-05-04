import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper to include auth header if logged in
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const LearningPlanService = {
  async createLearningPlan(planData) {
    return axios.post(
      `${API_URL}/api/learning-plans`,
      {
        topic: planData.topic,
        description: planData.description,
        resources: planData.resources.split(',').map(res => res.trim()),
        startDate: planData.startDate,
        endDate: planData.endDate
      },
      {
        withCredentials: true,
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
  },

  async getAllLearningPlans() {
    return axios.get(
      `${API_URL}/api/learning-plans`,
      {
        withCredentials: true,
        headers: authHeaders()
      }
    );
  },

  async getLearningPlanById(planId) {
    return axios.get(
      `${API_URL}/api/learning-plans/${planId}`,
      {
        withCredentials: true,
        headers: authHeaders()
      }
    );
  },

  async updateLearningPlan(planId, updateData) {
    return axios.put(
      `${API_URL}/api/learning-plans/${planId}`,
      {
        ...updateData,
        resources: updateData.resources.split(',').map(res => res.trim())
      },
      {
        withCredentials: true,
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
  },

  async deleteLearningPlan(planId) {
    return axios.delete(
      `${API_URL}/api/learning-plans/${planId}`,
      {
        withCredentials: true,
        headers: authHeaders()
      }
    );
  },

  async shareLearningPlan(planId) {
    // This could be extended to integrate with actual sharing functionality
    // For now, we'll just return the plan data
    return this.getLearningPlanById(planId);
  }
};
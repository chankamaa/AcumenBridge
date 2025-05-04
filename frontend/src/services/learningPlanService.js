import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper to include auth header if logged in
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper function to normalize resources (handles both string and array inputs)
function normalizeResources(resources) {
  if (Array.isArray(resources)) {
    return resources.map(res => res.trim());
  }
  return resources.split(',').map(res => res.trim());
}

export const LearningPlanService = {

  async getAllPublicLearningPlans() {
    return axios.get(`${API_URL}/api/learning-plans/public`, {
      headers: authHeaders()
    });
  },

  async createLearningPlan(planData) {
    return axios.post(
      `${API_URL}/api/learning-plans`,
      {
        ...planData,
        resources: normalizeResources(planData.resources),
        userId: localStorage.getItem('userId'), // Include user ID
        createdAt: new Date().toISOString() // Add creation timestamp
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
        resources: normalizeResources(updateData.resources),
        updatedAt: new Date().toISOString() // Add update timestamp
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
    const response = await this.getLearningPlanById(planId);
    return {
      ...response.data,
      shareText: this.generateShareText(response.data)
    };
  },

  // Add this method to your service
  repostLearningPlan: async (planId) => {
    return axios.post(
      `${API_URL}/api/learning-plans/${planId}/repost`,
      {},
      {
        headers: authHeaders()
      }
    );
  },

  generateShareText(plan) {
    return `Check out my learning plan: ${plan.topic}\n\n` +
           `${plan.description}\n\n` +
           `Resources:\n${plan.resources.join('\n')}\n\n` +
           `Schedule: ${new Date(plan.startDate).toLocaleDateString()} - ` +
           `${new Date(plan.endDate).toLocaleDateString()}`;
  }
};
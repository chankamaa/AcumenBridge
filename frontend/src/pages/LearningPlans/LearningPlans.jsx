import React, { useState, useEffect, useContext } from 'react';
import { LearningPlanService } from '../../services/learningPlanService';
import { AuthContext } from '../../context/AuthContext';
import './LearningPlans.css';

const LearningPlans = () => {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    resources: '',
    startDate: '',
    endDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const fetchLearningPlans = async () => {
    setIsLoading(true);
    try {
      const response = await LearningPlanService.getAllLearningPlans();
      setPlans(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch learning plans');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
  
    try {
      // Ensure resources is properly formatted as an array
      const resourcesArray = Array.isArray(formData.resources) 
        ? formData.resources 
        : formData.resources.split(',').map(res => res.trim());
  
      const planData = {
        ...formData,
        resources: resourcesArray,
        userId: user.id,
        createdAt: new Date().toISOString()
      };
  
      if (editingId) {
        await LearningPlanService.updateLearningPlan(editingId, planData);
        setSuccess('Learning plan updated successfully!');
      } else {
        await LearningPlanService.createLearningPlan(planData);
        setSuccess('Learning plan created successfully!');
      }
      fetchLearningPlans();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      topic: '',
      description: '',
      resources: '',
      startDate: '',
      endDate: ''
    });
    setEditingId(null);
  };

  const handleEdit = (plan) => {
    setFormData({
      topic: plan.topic,
      description: plan.description,
      resources: Array.isArray(plan.resources) 
        ? plan.resources.join(', ') 
        : plan.resources,
      startDate: plan.startDate,
      endDate: plan.endDate
    });
    setEditingId(plan.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      setIsLoading(true);
      try {
        await LearningPlanService.deleteLearningPlan(id);
        setSuccess('Learning plan deleted successfully!');
        fetchLearningPlans();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete learning plan');
        console.error('Delete error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="learning-plans-container">
      <h1>Learning Plans</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="learning-plan-form">
        <h2>{editingId ? 'Edit Learning Plan' : 'Create New Learning Plan'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Resources (comma separated)</label>
            <input
              type="text"
              name="resources"
              value={formData.resources}
              onChange={handleChange}
              placeholder="URL1, URL2, URL3"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (editingId ? 'Update' : 'Create')}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {isLoading && plans.length === 0 ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="plans-container">
          <h2 className="section-title">Available Learning Plans</h2>
          {plans.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-lightbulb"></i>
              <p>No learning plans available. Create one!</p>
            </div>
          ) : (
            <div className="modern-plans-grid">
              {plans.map(plan => (
                <div key={plan.id} className="modern-plan-card">
                  <div className="card-header">
                    <div className="user-info">
                      <div className="avatar">
                        {plan.userId?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="user-meta">
                        <span className="username">
                          User ID: {plan.userId?.substring(0, 8) || 'Anonymous'}
                        </span>
                        <span className="post-date">
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>{plan.topic}</h3>
                    <div className="date-range">
                      <i className="far fa-calendar-alt"></i>
                      {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </div>
                    <p className="description">{plan.description}</p>
                    
                    {plan.resources?.length > 0 && (
                      <div className="resources-section">
                        <h4><i className="fas fa-link"></i> Resources</h4>
                        <div className="resource-links">
                          {plan.resources.map((resource, index) => (
                            <a 
                              key={index} 
                              href={resource} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="resource-link"
                            >
                              <i className="fas fa-external-link-alt"></i> Resource {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button 
                      onClick={() => handleEdit(plan)} 
                      className="action-btn edit-btn"
                      disabled={isLoading}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)} 
                      className="action-btn delete-btn"
                      disabled={isLoading}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                    
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningPlans;
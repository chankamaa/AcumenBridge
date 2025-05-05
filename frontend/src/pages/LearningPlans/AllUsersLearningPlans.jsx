import React, { useState, useEffect } from 'react';
import { LearningPlanService } from '../../services/learningPlanService';
import './LearningPlans.css';

const AllUsersLearningPlans = () => {
  const [allPlans, setAllPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAllLearningPlans();
  }, []);

  const fetchAllLearningPlans = async () => {
    setIsLoading(true);
    try {
      const response = await LearningPlanService.getAllPublicLearningPlans();
      setAllPlans(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch all learning plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepost = async (planId) => {
    const userConfirmed = window.confirm('Are you sure you want to repost this learning plan?');
    
    if (!userConfirmed) return;

    try {
      setIsLoading(true);
      await LearningPlanService.repostLearningPlan(planId);
      
      setAllPlans(plans => plans.map(plan => 
        plan.id === planId 
          ? { ...plan, reposted: true, repostCount: (plan.repostCount || 0) + 1 }
          : plan
      ));
      
      setSuccessMessage('Learning plan reposted successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to repost learning plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="community-plans-container">
      <header className="community-header">
        <h1>Community Learning Plans</h1>
        <p className="subtitle">Discover and share knowledge from the community</p>
      </header>
      
      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {showSuccess && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Loading...
        </div>
      ) : (
        <div className="plans-container">
          {allPlans.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-lightbulb"></i>
              <p>No public learning plans available yet.</p>
            </div>
          ) : (
            <div className="modern-plans-grid">
              {allPlans.map(plan => (
                <div key={plan.id} className="modern-plan-card">
                  <div className="card-header">
                    <div className="user-info">
                      <div className="avatar">
                        {plan.userId?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="user-meta">
                        <span className="username">
                          {plan.username || `User ${plan.userId?.substring(0, 6) || 'Anonymous'}`}
                        </span>
                        <span className="post-date">
                          <i className="far fa-clock"></i> {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="repost-container">
                      <button 
                        onClick={() => handleRepost(plan.id)}
                        className={`repost-btn ${plan.reposted ? 'reposted' : ''}`}
                        disabled={isLoading}
                        aria-label="Repost this plan"
                      >
                        <i className={`fas fa-retweet ${plan.reposted ? 'text-blue-500' : 'text-gray-500'}`}></i>
                        {plan.repostCount > 0 && (
                          <span className="repost-count">{plan.repostCount}</span>
                        )}
                      </button>
                      {plan.reposted && (
                        <span className="repost-tooltip">Reposted!</span>
                      )}
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUsersLearningPlans;
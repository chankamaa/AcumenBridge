import React, { useState, useEffect } from 'react';
import { LearningPlanService } from '../../services/learningPlanService';
import './LearningPlans.css';

const AllUsersLearningPlans = () => {
  const [allPlans, setAllPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    try {
      await LearningPlanService.repostLearningPlan(planId);
      // Visual feedback instead of alert
      setAllPlans(plans => plans.map(plan => 
        plan.id === planId 
          ? { ...plan, reposted: true, repostCount: (plan.repostCount || 0) + 1 }
          : plan
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to repost learning plan');
    }
  };

  return (
    <div className="community-plans-container">
      <header className="community-header">
        <h1>Community Learning Plans</h1>
        <p className="subtitle">Discover and share knowledge from the community</p>
      </header>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
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
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button 
                    onClick={() => handleRepost(plan.id)}
                    className={`repost-btn ${plan.reposted ? 'reposted' : ''}`}
                    aria-label="Repost this plan"
                    >
                    <i className={`fas fa-share ${plan.reposted ? 'text-blue-500' : 'text-gray-500'}`}></i>
                    {plan.repostCount > 0 && <span className="repost-count">{plan.repostCount}</span>}
                    </button>
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
import React, { useState, useEffect } from 'react';
import { LearningPlanService } from '../../services/learningPlanService';
import './LearningPlans.css'; // Reuse your existing styles

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
    if (window.confirm('Do you want to share this learning plan with your network?')) {
      try {
        // Call your API endpoint for reposting/sharing
        await LearningPlanService.repostLearningPlan(planId);
        alert('Learning plan shared successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to share learning plan');
      }
    }
  };

  const handleShare = async (plan) => {
    try {
      const shareText = `Check out this learning plan: ${plan.topic}\n\n${plan.description}\n\nResources: ${plan.resources?.join(', ') || 'No resources provided'}`;
      
      if (navigator.share) {
        // Web Share API
        await navigator.share({
          title: plan.topic,
          text: shareText,
          url: window.location.href
        });
      } else if (navigator.clipboard) {
        // Clipboard fallback
        await navigator.clipboard.writeText(shareText);
        alert('Learning plan copied to clipboard!');
      } else {
        // Final fallback
        prompt('Copy this learning plan:', shareText);
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };


  return (
    <div className="learning-plans-container">
      <h1>Community Learning Plans</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="learning-plans-list">
          <h2>Explore What Others Are Learning</h2>
          {allPlans.length === 0 ? (
            <p>No public learning plans available yet.</p>
          ) : (
            <div className="plans-grid">
              {allPlans.map(plan => (
                <div key={plan.id} className="plan-card">
                  <div className="plan-user-info">
                    <div className="user-avatar">
                      {plan.userId?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="user-meta">
                      <span className="username">
                        {plan.username || `User ${plan.userId?.substring(0, 6) || 'Anonymous'}`}
                      </span>
                      <span className="created-date">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="plan-header">
                    <h3>{plan.topic}</h3>
                    <div className="plan-dates">
                      {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="plan-description">{plan.description}</p>

                  <div className="plan-resources">
                    <h4>Resources:</h4>
                    <ul>
                      {plan.resources?.map((resource, index) => (
                        <li key={index}>
                          <a href={resource} target="_blank" rel="noopener noreferrer">
                            Resource {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="plan-actions">
                    <button 
                    onClick={() => handleRepost(plan.id)}
                    className="btn-repost"
                    title="Share this plan with your network"
                    >
                    <i className="fas fa-retweet"></i> Repost
                    </button>
                    
                    <button 
                    onClick={() => handleShare(plan)}
                    className="btn-share"
                    title="Share this plan externally"
                    >
                    <i className="fas fa-share-alt"></i> Share
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

export default AllUsersLearningPlans;
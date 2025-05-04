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
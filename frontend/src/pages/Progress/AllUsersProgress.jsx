import React, { useState, useEffect } from 'react';
import { ProgressService } from '../../services/ProgressService';
import './Progress.css'; // Reuse the same CSS file

const AllUsersProgress = () => {
  const [allProgress, setAllProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllUsersProgress();
  }, []);

  const fetchAllUsersProgress = async () => {
    setIsLoading(true);
    try {
      const response = await ProgressService.getAllPublicProgress();
      setAllProgress(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch all progress');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgressPercentage = (completed, toComplete) => {
    if (toComplete <= 0) return 0;
    return Math.min(100, Math.round((completed / toComplete) * 100));
  };

  return (
    <div className="community-progress-container">
      <header className="community-header">
        <h1>Community Progress</h1>
        <p className="subtitle">See what others are working on</p>
      </header>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="progress-container">
          {allProgress.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-lightbulb"></i>
              <p>No public progress available yet.</p>
            </div>
          ) : (
            <div className="progress-grid">
              {allProgress.map(progress => (
                <div key={progress.id} className="progress-card">
                  {/* User ID header */}
                  <div className="user-id-header">
                    <div className="user-avatar">
                      {progress.userId?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="user-id">User: {progress.userId || 'Anonymous'}</span>
                  </div>

                  <div className="card-content">
                    <div className="achievement-type">
                      {progress.achievementType}
                    </div>
                    <h3>{progress.head}</h3>
                    <p className="description">{progress.description}</p>
                    
                    <div className="progress-section">
                      <div className="progress-info">
                        <span>{progress.completed} of {progress.toComplete} completed</span>
                        <span>{calculateProgressPercentage(progress.completed, progress.toComplete)}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${calculateProgressPercentage(progress.completed, progress.toComplete)}%`,
                            backgroundColor: getProgressColor(calculateProgressPercentage(progress.completed, progress.toComplete))
                          }}
                        ></div>
                      </div>
                    </div>
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

// Helper function for progress bar colors
const getProgressColor = (percentage) => {
  if (percentage < 30) return '#ef4444'; // red
  if (percentage < 70) return '#f59e0b'; // amber
  return '#10b981'; // emerald
};

export default AllUsersProgress;
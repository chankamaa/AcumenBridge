import React, { useState, useEffect } from 'react';
import { ProgressService } from '../../services/ProgressService';
import './Progress.css';

const AllUsersProgress = () => {
  const [allProgress, setAllProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [localLikes, setLocalLikes] = useState({}); // Track likes locally

  useEffect(() => {
    fetchAllUsersProgress();
  }, []);

  const fetchAllUsersProgress = async () => {
    setIsLoading(true);
    try {
      const response = await ProgressService.getAllPublicProgress();
      setAllProgress(response.data);
      // Initialize local likes state
      const likesState = {};
      response.data.forEach(progress => {
        likesState[progress.id] = {
          count: progress.likes || 0,
          liked: false // You might want to check if current user has liked this
        };
      });
      setLocalLikes(likesState);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch all progress');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (progressId) => {
    try {
      // Optimistic UI update
      setLocalLikes(prev => ({
        ...prev,
        [progressId]: {
          count: prev[progressId].liked ? prev[progressId].count - 1 : prev[progressId].count + 1,
          liked: !prev[progressId].liked
        }
      }));

      // API call to update like
      await ProgressService.toggleLike(progressId);
      
      // Optional: Refresh data to ensure sync
      // fetchAllUsersProgress();
    } catch (err) {
      // Revert on error
      setLocalLikes(prev => ({
        ...prev,
        [progressId]: {
          count: prev[progressId].count,
          liked: prev[progressId].liked
        }
      }));
      console.log(err);
      setError('Failed to update like');
    }
  };

  const calculateProgressPercentage = (completed, toComplete) => {
    if (toComplete <= 0) return 0;
    return Math.min(100, Math.round((completed / toComplete) * 100));
  };

  // Function to get icon for achievement type
  const getAchievementIcon = (type) => {
    switch(type) {
      case 'Course':
        return <i className="fa-solid fa-graduation-cap"></i>;
      case 'Project':
        return <i className="fa-solid fa-shield"></i>;
      case 'Skill':
        return <i className="fa-solid fa-trophy"></i>;
      case 'Certification':
        return <i className="fa-solid fa-award"></i>;
      default:
        return <i className="fa-solid fa-star"></i>;
    }
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
                <div 
                  key={progress.id} 
                  className={`progress-card template-${progress.template || 'default'}`}
                >
                  <div className="card-content-wrapper">
                    {/* User header */}
                    <div className="card-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          {progress.userId?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="user-id">User {progress.userId?.substring(0, 6) || 'Anonymous'}</span>
                      </div>
                      <span className="date">
                        {new Date(progress.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Content with achievement icon */}
                    <div className="achievement-type">
                      {getAchievementIcon(progress.achievementType)}
                      <span>{progress.achievementType}</span>
                    </div>
                    <h3><b>{progress.head}</b></h3>
                    <p className="description">{progress.description}</p>
                    
                    {/* Progress bar */}
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
                      <div className="like-section">
                        <button 
                          className={`like-button ${localLikes[progress.id]?.liked ? 'liked' : ''}`}
                          onClick={() => handleLike(progress.id)}
                        >
                          <i class="fa-regular fa-heart"></i>
                          <span>{localLikes[progress.id]?.count || 0}</span>
                        </button>
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
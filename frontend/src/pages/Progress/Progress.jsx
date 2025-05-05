import React, { useState, useEffect, useContext } from 'react';
import { ProgressService } from '../../services/ProgressService';
import { AuthContext } from '../../context/AuthContext';
import './Progress.css';

const Progress = () => {
  const { user } = useContext(AuthContext);
  const [progressList, setProgressList] = useState([]);
  const [formData, setFormData] = useState({
    achievementType: '',
    head: '',
    description: '',
    completed: 0,
    toComplete: 100
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllProgress();
  }, []);

  const fetchAllProgress = async () => {
    setIsLoading(true);
    try {
      const response = await ProgressService.getAllProgress();
      setProgressList(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch progress');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'completed' || name === 'toComplete' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const progressData = {
        ...formData,
        userId: user.id,
        createdAt: new Date().toISOString()
      };

      if (editingId) {
        await ProgressService.updateProgress(editingId, progressData);
        setSuccess('Progress updated successfully!');
      } else {
        await ProgressService.createProgress(progressData);
        setSuccess('Progress created successfully!');
      }
      fetchAllProgress();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      achievementType: '',
      head: '',
      description: '',
      completed: 0,
      toComplete: 100
    });
    setEditingId(null);
  };

  const handleEdit = (progress) => {
    setFormData({
      achievementType: progress.achievementType,
      head: progress.head,
      description: progress.description,
      completed: progress.completed,
      toComplete: progress.toComplete
    });
    setEditingId(progress.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this progress?')) {
      setIsLoading(true);
      try {
        await ProgressService.deleteProgress(id);
        setSuccess('Progress deleted successfully!');
        fetchAllProgress();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete progress');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateProgress = (completed, toComplete) => {
    if (toComplete <= 0) return 0;
    return Math.min(100, Math.round((completed / toComplete) * 100));
  };

  return (
    <div className="progress-container">
      <h1>Progress Tracking</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="progress-form">
        <h2>{editingId ? 'Edit Progress' : 'Add New Progress'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Achievement Type</label>
            <select
              name="achievementType"
              value={formData.achievementType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Course">Course</option>
              <option value="Project">Project</option>
              <option value="Skill">Skill</option>
              <option value="Certification">Certification</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="head"
              value={formData.head}
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
          
          <div className="form-row">
            <div className="form-group">
              <label>Completed</label>
              <input
                type="number"
                name="completed"
                min="0"
                value={formData.completed}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Total to Complete</label>
              <input
                type="number"
                name="toComplete"
                min="1"
                value={formData.toComplete}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="progress-preview">
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${calculateProgress(formData.completed, formData.toComplete)}%` }}
              >
                {calculateProgress(formData.completed, formData.toComplete)}%
              </div>
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

      {isLoading && progressList.length === 0 ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="progress-list">
          <h2>Your Progress</h2>
          {progressList.length === 0 ? (
            <p>No progress entries available. Add one!</p>
          ) : (
            <div className="progress-grid">
              {progressList.map(progress => (
                <div key={progress.id} className="progress-card">
                  <div className="card-header">
                    <span className="achievement-type">{progress.achievementType}</span>
                    <span className="date">{new Date(progress.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <h3>{progress.head}</h3>
                  <p className="description">{progress.description}</p>
                  
                  <div className="progress-section">
                    <div className="progress-info">
                      <span>{progress.completed} of {progress.toComplete} completed</span>
                      <span>{calculateProgress(progress.completed, progress.toComplete)}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{ width: `${calculateProgress(progress.completed, progress.toComplete)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      onClick={() => handleEdit(progress)} 
                      className="btn-edit"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(progress.id)} 
                      className="btn-delete"
                      disabled={isLoading}
                    >
                      Delete
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

export default Progress;
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ProgressService } from '../../services/ProgressService';
import { AuthContext } from '../../context/AuthContext';
import './Progress.css';

const Progress = () => {
  const { user } = useContext(AuthContext);
  const formRef = useRef(null); // Create a ref for the form
  const [progressList, setProgressList] = useState([]);
  const [formData, setFormData] = useState({
    achievementType: '',
    head: '',
    description: '',
    completed: 0,
    toComplete: 100,
    template: 'default'
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Template options with colors and labels
  const templateOptions = [
    // Default
    { 
      value: 'default', 
      label: 'Default', 
      type: 'color',
      style: { backgroundColor: '#ffffff' } 
    },
    
    // Blue variations
    { 
      value: 'blue', 
      label: 'Blue Solid', 
      type: 'color',
      style: { backgroundColor: '#e0f2fe' } 
    },
    { 
      value: 'blue-dots', 
      label: 'Blue Dots', 
      type: 'pattern',
      style: { 
        backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
        backgroundSize: '15px 15px'
      } 
    },
    { 
      value: 'blue-lines', 
      label: 'Blue Lines', 
      type: 'pattern',
      style: { 
        backgroundImage: 'repeating-linear-gradient(45deg, #bfdbfe, #bfdbfe 2px, #93c5fd 2px, #93c5fd 4px)'
      } 
    },
    { 
      value: 'blue-grid', 
      label: 'Blue Grid', 
      type: 'pattern',
      style: { 
        backgroundImage: `
          linear-gradient(to right, #bfdbfe 1px, transparent 1px),
          linear-gradient(to bottom, #bfdbfe 1px, transparent 1px)
        `,
        backgroundSize: '15px 15px'
      } 
    },
    { 
      value: 'blue-diagonal', 
      label: 'Blue Diagonal', 
      type: 'pattern',
      style: { 
        backgroundImage: 'repeating-linear-gradient(-45deg, #bfdbfe, #bfdbfe 2px, #93c5fd 2px, #93c5fd 4px)'
      } 
    },
    
    // Green variations
    { 
      value: 'green', 
      label: 'Green Solid', 
      type: 'color',
      style: { backgroundColor: '#dcfce7' } 
    },
    { 
      value: 'green-dots', 
      label: 'Green Dots', 
      type: 'pattern',
      style: { 
        backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
        backgroundSize: '15px 15px'
      } 
    },
    { 
      value: 'green-lines', 
      label: 'Green Lines', 
      type: 'pattern',
      style: { 
        backgroundImage: 'repeating-linear-gradient(45deg, #d1fae5, #d1fae5 2px, #a7f3d0 2px, #a7f3d0 4px)'
      } 
    },
    { 
      value: 'green-grid', 
      label: 'Green Grid', 
      type: 'pattern',
      style: { 
        backgroundImage: `
          linear-gradient(to right, #d1fae5 1px, transparent 1px),
          linear-gradient(to bottom, #d1fae5 1px, transparent 1px)
        `,
        backgroundSize: '15px 15px'
      } 
    },
    { 
      value: 'green-diagonal', 
      label: 'Green Diagonal', 
      type: 'pattern',
      style: { 
        backgroundImage: 'repeating-linear-gradient(-45deg, #d1fae5, #d1fae5 2px, #a7f3d0 2px, #a7f3d0 4px)'
      } 
    },
    
    // Purple variations
    { 
      value: 'purple', 
      label: 'Purple Solid', 
      type: 'color',
      style: { backgroundColor: '#f3e8ff' } 
    },
    { 
      value: 'purple-dots', 
      label: 'Purple Dots', 
      type: 'pattern',
      style: { 
        backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)',
        backgroundSize: '15px 15px'
      } 
    },
    { 
      value: 'purple-lines', 
      label: 'Purple Lines', 
      type: 'pattern',
      style: { 
        backgroundImage: 'repeating-linear-gradient(45deg, #ddd6fe, #ddd6fe 2px, #c4b5fd 2px, #c4b5fd 4px)'
      } 
    },
    { 
      value: 'purple-grid', 
      label: 'Purple Grid', 
      type: 'pattern',
      style: { 
        backgroundImage: `
          linear-gradient(to right, #ddd6fe 1px, transparent 1px),
          linear-gradient(to bottom, #ddd6fe 1px, transparent 1px)
        `,
        backgroundSize: '15px 15px'
      } 
    },
    { 
      value: 'purple-diagonal', 
      label: 'Purple Diagonal', 
      type: 'pattern',
      style: { 
        backgroundImage: 'repeating-linear-gradient(-45deg, #ddd6fe, #ddd6fe 2px, #c4b5fd 2px, #c4b5fd 4px)'
      } 
    },
    
    // Orange variations
    { 
      value: 'orange', 
      label: 'Orange Solid', 
      type: 'color',
      style: { backgroundColor: '#ffedd5' } 
    },
    { 
      value: 'orange-dots', 
      label: 'Orange Dots', 
      type: 'pattern',
      style: { 
        backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)',
        backgroundSize: '15px 15px'
      } 
    },
    { 
      value: 'orange-lines', 
      label: 'Orange Lines', 
      type: 'pattern',
      style: { 
        backgroundImage: 'repeating-linear-gradient(45deg, #fed7aa, #fed7aa 2px, #fdba74 2px, #fdba74 4px)'
      } 
    },
    { 
      value: 'orange-grid', 
      label: 'Orange Grid', 
      type: 'pattern',
      style: { 
        backgroundImage: `
          linear-gradient(to right, #fed7aa 1px, transparent 1px),
          linear-gradient(to bottom, #fed7aa 1px, transparent 1px)
        `,
        backgroundSize: '15px 15px'
      } 
    },
    { 
      value: 'orange-diagonal', 
      label: 'Orange Diagonal', 
      type: 'pattern',
      style: { 
        backgroundImage: 'repeating-linear-gradient(-45deg, #fed7aa, #fed7aa 2px, #fdba74 2px, #fdba74 4px)'
      } 
    }
  ];

  useEffect(() => {
    fetchAllProgress();
  }, []);

   // Scroll to form when editing
   useEffect(() => {
    if (editingId && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingId]);

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

  const handleTemplateSelect = (templateValue) => {
    setFormData(prev => ({
      ...prev,
      template: templateValue
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
      toComplete: 100,
      template: 'default'
    });
    setEditingId(null);
  };

  const handleEdit = (progress) => {
    setFormData({
      achievementType: progress.achievementType,
      head: progress.head,
      description: progress.description,
      completed: progress.completed,
      toComplete: progress.toComplete,
      template: progress.template || 'default'
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

      <div className="progress-form" ref={formRef}>
        <div className="form-header">
          <h2>{editingId ? '✏️ Edit Progress' : '➕ Add New Progress'}</h2>
          {editingId && (
            <button 
              onClick={resetForm}
              className="btn-clear"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <br></br>
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
                <option value="Course">📚 Course</option>
                <option value="Project">🛠️ Project</option>
                <option value="Skill">🏆 Skill</option>
                <option value="Certification">🏅 Certification</option>
                <option value="Other">✨ Other</option>
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
              <span className="input-icon">✓</span>
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
              <span className="input-icon">⏱️</span>
            </div>
          </div>

          <div className="form-group">
            <label>Card Design</label>
            <div className="design-selection">
              {['blue', 'green', 'purple', 'orange'].map(color => (
                <div key={color} className="color-group">
                  <h4>{color.charAt(0).toUpperCase() + color.slice(1)}</h4>
                  <div className="template-options">
                    {templateOptions
                      .filter(opt => opt.value === color || opt.value.startsWith(`${color}-`))
                      .map(option => (
                        <div 
                          key={option.value}
                          className={`template-option ${formData.template === option.value ? 'selected' : ''}`}
                          onClick={() => handleTemplateSelect(option.value)}
                          style={option.style}
                          title={option.label}
                        >
                          {formData.template === option.value && (
                            <i className="fas fa-check"></i>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
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
                <div 
                key={progress.id} 
                className={`progress-card template-${progress.template || 'default'}`}
              >
                <div className="card-content-wrapper">
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
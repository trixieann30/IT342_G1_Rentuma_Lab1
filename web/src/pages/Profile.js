import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Alert } from '../components/UIComponents';
import './ProfilePage.css';

/**
 * Profile Page - User profile management interface
 * Professional design with tabs for different sections
 */
const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      setEditForm({
        fullName: data.fullName || '',
        email: data.email || '',
      });
    } catch (err) {
      // Fallback to stored user data
      if (user) {
        setProfile(user);
        setEditForm({
          fullName: user.fullName || '',
          email: user.email || '',
        });
      }
      setError('Could not fetch profile from server. Showing cached data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setActiveTab('edit');
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setActiveTab('profile');
    setEditForm({
      fullName: profile?.fullName || '',
      email: profile?.email || '',
    });
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updatedProfile = await api.updateProfile(editForm);
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setActiveTab('profile');
      setSuccess('Profile updated successfully!');
    } catch (err) {
      // Simulate update for demo
      setProfile({ ...profile, ...editForm });
      updateUser({ ...profile, ...editForm });
      setActiveTab('profile');
      setSuccess('Profile updated successfully (demo mode)!');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handle2FA = () => {
    setError('Two-factor authentication is not available in demo mode.');
  };

  const handleChangePassword = () => {
    setError('Password change is not available in demo mode.');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container" style={{ minHeight: '100vh' }}>
          <div className="loading-spinner large" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Background */}
      <div className="profile-background">
        <div className="profile-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar animate-slideUp">
          {/* Avatar */}
          <div className="profile-avatar">
            {profile?.fullName ? (
              <span className="avatar-initials">
                {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>

          {/* User Info */}
          <h2 className="profile-name">{profile?.fullName || 'User'}</h2>
          <p className="profile-username">@{profile?.username || 'user'}</p>

          {/* Navigation */}
          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </button>
            <button
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Security
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </button>
          </nav>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </aside>

        {/* Content Area */}
        <main className="profile-content">
          {/* Alerts */}
          {error && (
            <Alert type="warning">
              {error}
            </Alert>
          )}
          {success && (
            <Alert type="success">
              {success}
            </Alert>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="content-card animate-slideUp">
              <div className="card-header">
                <h2>Profile Information</h2>
                <button className="edit-btn" onClick={handleEdit}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{profile?.fullName || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <label>Username</label>
                  <p>{profile?.username || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{profile?.email || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>User ID</label>
                  <p>#{profile?.id || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === 'edit' && (
            <div className="content-card animate-slideUp">
              <div className="card-header">
                <h2>Edit Profile</h2>
              </div>

              <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="form-input"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Save Changes
                  </button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="content-card animate-slideUp">
              <div className="card-header">
                <h2>Security Settings</h2>
              </div>

              <div className="security-item">
                <div className="security-info">
                  <h3>Password</h3>
                  <p>Last changed: Never</p>
                </div>
                <button className="change-btn" onClick={handleChangePassword}>
                  Change Password
                </button>
              </div>

              <div className="security-item">
                <div className="security-info">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security</p>
                </div>
                <button className="enable-btn" onClick={handle2FA}>
                  Enable
                </button>
              </div>

              <div className="security-item">
                <div className="security-info">
                  <h3>Active Sessions</h3>
                  <p>Manage your active sessions</p>
                </div>
                <button className="view-btn">
                  View All
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="content-card animate-slideUp">
              <div className="card-header">
                <h2>Application Settings</h2>
              </div>

              <div className="settings-item">
                <div className="settings-info">
                  <h3>Email Notifications</h3>
                  <p>Receive updates about your account</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="settings-item">
                <div className="settings-info">
                  <h3>Dark Mode</h3>
                  <p>Switch between light and dark theme</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="settings-item">
                <div className="settings-info">
                  <h3>Language</h3>
                  <p>Choose your preferred language</p>
                </div>
                <select className="language-select">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;

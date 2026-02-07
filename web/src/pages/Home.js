import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

/**
 * Home Page - Landing page with authentication-aware content
 * Professional design with hero section and feature highlights
 */
const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>AuthApp</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/register" className="nav-link btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content animate-slideUp">
            <h1>
              Secure Authentication
              <br />
              <span className="gradient-text">Made Simple</span>
            </h1>
            <p>
              A modern, secure authentication system built with Spring Boot and React.
              JWT-based security, professional UI, and seamless user experience.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Create Free Account
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="visual-card">
              <div className="card-header-dots">
                <span />
                <span />
                <span />
              </div>
              <div className="card-content">
                <div className="mock-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="mock-field">
                  <span className="mock-label">Username</span>
                  <span className="mock-value">john_doe</span>
                </div>
                <div className="mock-field">
                  <span className="mock-label">Email</span>
                  <span className="mock-value">john@example.com</span>
                </div>
                <div className="mock-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Verified Account
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-elements">
              <div className="float-element elem-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="float-element elem-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="animate-slideUp">Features</h2>
          <div className="features-grid">
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>JWT Authentication</h3>
              <p>Secure token-based authentication with configurable expiration and refresh mechanisms.</p>
            </div>
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>BCrypt Encryption</h3>
              <p>Industry-standard password hashing with salt rounds for maximum security.</p>
            </div>
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>Session Management</h3>
              <p>Token-based sessions with secure storage and automatic cleanup on logout.</p>
            </div>
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>User Management</h3>
              <p>Complete user profile management with edit capabilities and data persistence.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content animate-slideUp">
            <h2>Ready to Get Started?</h2>
            <p>Create your account in seconds and experience secure authentication.</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Create Free Account
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>Built with Spring Boot & React</p>
      </footer>
    </div>
  );
};

export default Home;

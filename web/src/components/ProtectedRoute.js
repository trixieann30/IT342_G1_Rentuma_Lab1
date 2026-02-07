import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Loading Spinner Component
 */
const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeMap = { small: 20, medium: 24, large: 48 };
  return (
    <div style={{
      width: sizeMap[size],
      height: sizeMap[size],
      border: '3px solid var(--slate-200)',
      borderTopColor: 'var(--primary-500)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  );
};

/**
 * ProtectedRoute - Protects routes that require authentication
 * Redirects unauthenticated users to login page
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.requireAuth - Whether to require authentication (default: true)
 */
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        color: 'var(--slate-500)'
      }}>
        <LoadingSpinner size="large" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  // If route requires auth and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires no auth (guest only) and user is authenticated, redirect to profile
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  // User is authenticated, render children
  return children;
};

// Add spin animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default ProtectedRoute;

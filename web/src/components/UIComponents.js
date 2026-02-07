import React from 'react';

/**
 * LoadingSpinner - Reusable loading indicator
 * @param {Object} props
 * @param {string} props.size - Size: 'small', 'medium', 'large'
 * @param {string} props.color - Custom color
 */
export const LoadingSpinner = ({ size = 'medium', color, style }) => {
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 48,
  };

  const spinnerStyle = {
    width: sizeMap[size],
    height: sizeMap[size],
    border: `3px solid var(--slate-200)`,
    borderTopColor: color || 'var(--primary-500)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    ...style,
  };

  return <div style={spinnerStyle} role="status" aria-label="Loading" />;
};

/**
 * Button - Reusable button component
 * @param {Object} props
 * @param {string} props.variant - Button style: 'primary', 'secondary', 'danger', 'ghost'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.disabled - Disable button
 * @param {React.ReactNode} props.children - Button content
 */
export const Button = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  const sizeClasses = {
    small: 'btn-sm',
    medium: '',
    large: 'btn-lg',
  };

  const classNames = [
    'btn',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="small" />}
      {children}
    </button>
  );
};

/**
 * Input - Reusable input component
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {React.ReactNode} props.icon - Icon element
 * @param {boolean} props.showPasswordToggle - Show password visibility toggle
 */
export const Input = ({
  label,
  error,
  icon,
  showPasswordToggle,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const inputType = showPasswordToggle
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={inputType}
          className={`form-input ${error ? 'error' : ''}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon />
            ) : (
              <EyeIcon />
            )}
          </button>
        )}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

/**
 * Alert - Reusable alert component
 * @param {Object} props
 * @param {string} props.type - Alert type: 'success', 'error', 'warning', 'info'
 * @param {React.ReactNode} props.children - Alert content
 */
export const Alert = ({ type = 'info', children, className = '' }) => {
  const icons = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />,
  };

  return (
    <div className={`alert alert-${type} ${className}`}>
      <span className="alert-icon">{icons[type]}</span>
      <div className="alert-content">{children}</div>
    </div>
  );
};

// Icon Components
const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default {
  LoadingSpinner,
  Button,
  Input,
  Alert,
};

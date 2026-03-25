import React, { useState, useEffect } from 'react';
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/auth.css';

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="20"
    height="20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="20"
    height="20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('request'); 
  const [oobCode, setOobCode] = useState(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
      setMode('reset');
    }
  }, [searchParams]);

  const generatePassword = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let password = '';
    
    password += letters[Math.floor(Math.random() * letters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    
    const allChars = letters + numbers;
    for (let i = password.length; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    const finalPassword = password.split('').sort(() => Math.random() - 0.5).join('');
    setNewPassword(finalPassword);
    setConfirmPassword(finalPassword);
    return finalPassword;
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 30) {
      return 'Password must be between 8 and 30 characters';
    }
    if (!/[A-Za-z]/.test(password)) {
      return 'Password must contain at least one letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset link sent to ${email}. Please check your inbox.`);
      setEmail('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    setLoading(true);
    
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password successfully changed! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Invalid or expired reset link. Please request a new one.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'request') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>
          
          <form onSubmit={handleSendResetEmail}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div className="auth-footer">
              <Link to="/login">Back to Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create New Password</h1>
          <p>Enter your new password below</p>
        </div>
        
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>New Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            </div>
          </div>
          
          <div style={{ marginTop: '12px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => generatePassword()}
              className="generate-password-btn"
            >
              Generate Strong Password
            </button>
            {generatedPassword && (
              <div className="generated-password">
                Suggested password: <strong>{generatedPassword}</strong>
              </div>
            )}
          </div>
          
          <small className="hint-text">
            Password must be 8-30 characters, contain letters and numbers
          </small>
          
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
          
          <div className="auth-footer">
            <Link to="/login">Back to Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
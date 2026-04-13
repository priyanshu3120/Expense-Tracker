import React, { useEffect, useState, useRef } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';

document.title = 'Login — Expense Tracker';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("User")) {
      navigate("/");
    }
  }, [navigate]);

  const submitForm = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      setIsLoading(true);
      ref.current.staticStart();
      const response = await axiosClient.post('/auth/login', { email, password });

      if (response.data.statusCode !== 201) {
        toast.error(response.data.message);
        setIsLoading(false);
        ref.current.complete();
        return;
      }

      const { token, user } = response.data.message;
      localStorage.setItem('token', token);
      localStorage.setItem('User', JSON.stringify(user));

      toast.success(`Welcome back, ${user.username}! 👋`);
      ref.current.complete();
      navigate('/');
    } catch (error) {
      toast.error("Connection error. Please try again.");
      setIsLoading(false);
      ref.current.complete();
    }
  };

  return (
    <div className="auth-bg">
      <LoadingBar color='#f59e0b' ref={ref} />

      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="brand-icon">💰</div>
            <h1 className="brand-title">
              <span className="brand-highlight">Expense</span>
              <br />Tracker
            </h1>
            <p className="brand-subtitle">
              Take control of your finances. Track, analyze, and manage your spending with ease.
            </p>
          </div>
          <div className="auth-features">
            <div className="feature-item"><span>📊</span> Visual expense analytics</div>
            <div className="feature-item"><span>🗂️</span> Category-wise tracking</div>
            <div className="feature-item"><span>📧</span> Email expense reports</div>
          </div>
        </div>

        {/* Divider */}
        <div className="auth-divider" />

        {/* Right Panel — Form */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-title">Welcome back</h2>
              <p className="auth-subtitle">Sign in to your account</p>
            </div>

            <form onSubmit={submitForm} className="auth-form">
              <div className="input-group">
                <span className="input-icon">✉️</span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  autoComplete="email"
                />
              </div>

              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <button
                id="login-submit"
                type="submit"
                className={`auth-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <span className="spinner" /> : 'Sign In'}
              </button>
            </form>

            <p className="auth-link-text">
              New here?{' '}
              <a href="/signup" className="auth-link">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
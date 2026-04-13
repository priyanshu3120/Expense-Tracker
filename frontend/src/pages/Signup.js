import React, { useEffect, useState, useRef } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

document.title = 'Sign Up — Expense Tracker';

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
    if (!username || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      setIsLoading(true);
      ref.current.staticStart();
      const response = await axiosClient.post('/auth/signup', { username, email, password });

      if (response.data.statusCode !== 201) {
        toast.error(response.data.message);
        setIsLoading(false);
        ref.current.complete();
        return;
      }

      toast.success("Account created! Please log in.");
      ref.current.complete();
      navigate("/login");
    } catch (error) {
      toast.error("Connection error. Please try again.");
      setIsLoading(false);
      ref.current.complete();
    }
  };

  return (
    <div className="auth-bg">
      <LoadingBar color='#f59e0b' ref={ref} />

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
              Join thousands managing their money smarter. Sign up and get started for free.
            </p>
          </div>
          <div className="auth-features">
            <div className="feature-item"><span>✅</span> Free forever</div>
            <div className="feature-item"><span>🔐</span> Secure & private</div>
            <div className="feature-item"><span>⚡</span> Instant setup</div>
          </div>
        </div>

        <div className="auth-divider" />

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-title">Create account</h2>
              <p className="auth-subtitle">Start tracking your expenses today</p>
            </div>

            <form onSubmit={submitForm} className="auth-form">
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  id="signup-username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                  autoComplete="username"
                />
              </div>

              <div className="input-group">
                <span className="input-icon">✉️</span>
                <input
                  id="signup-email"
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
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  autoComplete="new-password"
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
                id="signup-submit"
                type="submit"
                className={`auth-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <span className="spinner" /> : 'Create Account'}
              </button>
            </form>

            <p className="auth-link-text">
              Already have an account?{' '}
              <a href="/login" className="auth-link">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
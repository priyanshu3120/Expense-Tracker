import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BsSendFill } from 'react-icons/bs';
import { sendEmail } from '../utils/renders';
import LoadingBar from 'react-top-loading-bar';

function NavBar(props) {
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const ref = useRef(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('User'));
  const userName = userData?.username || 'User';
  const userInitials = userName.slice(0, 2).toUpperCase();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const logoutHandle = async () => {
    try {
      ref.current.staticStart();
      localStorage.removeItem('User');
      localStorage.removeItem('token');
      toast.success("Logged out successfully!");
      ref.current.complete();
      navigate('/login');
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="navbar">
      <LoadingBar color='#f59e0b' ref={ref} />

      {/* Brand */}
      <div className="navbar-brand">
        <span className="navbar-logo">💰</span>
        <span className="navbar-title">
          <span className="navbar-title-highlight">Expense</span> Tracker
        </span>
      </div>

      {/* Greeting */}
      <div className="navbar-greeting">
        <span>{getGreeting()}, <strong>{userName}</strong> 👋</span>
      </div>

      {/* Right actions */}
      <div className="navbar-actions">

        {/* Email button */}
        <div className="email-wrapper">
          <button
            id="send-email-btn"
            className="navbar-btn email-btn"
            onClick={() => setIsEmailOpen(!isEmailOpen)}
          >
            <BsSendFill className="btn-icon" />
            <span>Send Report</span>
          </button>

          {isEmailOpen && (
            <div className="email-dropdown">
              <button
                className="email-close"
                onClick={() => setIsEmailOpen(false)}
                aria-label="Close"
              >×</button>
              <p className="email-hint">📨 Get your monthly expenses by email</p>
              <div className="email-row">
                <input
                  id="email-input"
                  placeholder="Your email address"
                  onChange={(e) => setUserEmail(e.target.value)}
                  type="email"
                  className="email-input"
                />
                <button
                  id="send-email-submit"
                  onClick={() => {
                    sendEmail(userEmail, props.data);
                    setIsEmailOpen(false);
                  }}
                  className="email-send-btn"
                  aria-label="Send email"
                >
                  <BsSendFill />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar + logout */}
        <div className="user-section">
          <div className="user-avatar" title={userName}>
            {userInitials}
          </div>
          <button
            id="logout-btn"
            className="navbar-btn logout-btn"
            onClick={logoutHandle}
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default NavBar;
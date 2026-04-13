import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Items from '../components/Items';
import { Chartss } from '../components/Chartss';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import LoadingBar from 'react-top-loading-bar';
import { createExpense, getUserExpenses } from '../utils/renders';
import NavBar from '../components/NavBar';
import { toast } from 'react-hot-toast';

document.title = 'Dashboard — Expense Tracker';

const CATEGORIES = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];

function Home() {
  const navigate = useNavigate();
  const [selectDate, setSelectedDate] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [userdata] = useState(JSON.parse(localStorage.getItem('User')));
  const [userexp, setUserexp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem('token') || !localStorage.getItem('User')) {
      navigate('/login');
      return;
    }
    getUserExpenses(userdata._id).then((data) => {
      setUserexp(data || []);
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  const getTotal = () => {
    return userexp.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleCreateExpense = () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (!category) {
      toast.error("Please select a category.");
      return;
    }
    if (!selectDate) {
      toast.error("Please select a date.");
      return;
    }
    const expInfo = {
      usersid: userdata._id,
      category,
      date: selectDate,
      amount: Number(amount),
    };
    ref.current.staticStart();
    createExpense(expInfo);
    ref.current.complete();
  };

  return (
    <div className="home-bg">
      <LoadingBar color='#f59e0b' ref={ref} />
      <NavBar data={userexp} />

      <div className="dashboard">
        {/* Left: Chart */}
        <div className="dashboard-left">
          <div className="chart-panel">
            <Chartss exdata={userexp} />
          </div>

          {/* Stats */}
          <div className="stats-panel">
            <div className="stat-card">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">₹{getTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Transactions</span>
              <span className="stat-value">{userexp.length}</span>
            </div>
          </div>
        </div>

        {/* Right: Form + Expense List */}
        <div className="dashboard-right">
          {/* Create Transaction */}
          <div className="create-card">
            <h2 className="create-title">➕ New Transaction</h2>
            <div className="create-row">
              <div className="input-group-home">
                <label className="input-label">Amount (₹)</label>
                <input
                  id="expense-amount"
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  value={amount}
                  className="home-input"
                  min="1"
                />
              </div>
              <div className="input-group-home">
                <label className="input-label">Category</label>
                <select
                  id="expense-category"
                  onChange={(e) => setCategory(e.target.value)}
                  defaultValue=""
                  className="home-input home-select"
                >
                  <option value="" disabled>Select...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="input-group-home">
                <label className="input-label">Date</label>
                <DatePicker
                  selected={selectDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="home-input"
                  placeholderText="Pick a date"
                  showYearDropdown
                  maxDate={new Date()}
                />
              </div>
            </div>
            <button
              id="add-expense-btn"
              onClick={handleCreateExpense}
              className="add-btn"
            >
              Add Expense
            </button>
          </div>

          {/* Expense List */}
          <div className="expense-list-panel">
            <div className="expense-list-header">
              <h2 className="expense-list-title">Recent Transactions</h2>
              <span className="expense-total-badge">Total: ₹{getTotal().toLocaleString('en-IN')}</span>
            </div>

            {isLoading ? (
              <div className="loading-state">
                {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
              </div>
            ) : userexp.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💸</div>
                <p className="empty-title">No expenses yet</p>
                <p className="empty-sub">Add your first transaction above</p>
              </div>
            ) : (
              <div className="expense-list">
                {userexp.map((item) => (
                  <Items key={item._id} data={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
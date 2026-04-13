import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { deleteExpense } from '../utils/renders';

const CATEGORY_CONFIG = {
  Grocery:  { icon: '🛒', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  Vehicle:  { icon: '🚗', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  Shopping: { icon: '🛍️', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
  Travel:   { icon: '✈️', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  Food:     { icon: '🍔', color: '#ef4444', bg: 'rgba(239,68,68,0.15)'  },
  Fun:      { icon: '🎮', color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  Other:    { icon: '📦', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)'},
};

function Items(props) {
  const exp = props.data;
  const config = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG['Other'];

  const getDate = () => {
    const d = new Date(Date.parse(exp.date));
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ₹${exp.amount} (${exp.category})?`)) {
      deleteExpense({ expenseId: exp._id, userId: exp.usersid });
    }
  };

  return (
    <div className="expense-card" style={{ borderLeft: `3px solid ${config.color}` }}>
      <div className="expense-card-top">
        <div className="expense-category-icon" style={{ background: config.bg, color: config.color }}>
          {config.icon}
        </div>
        <div className="expense-info">
          <span className="expense-category" style={{ color: config.color }}>{exp.category}</span>
          <span className="expense-date">{getDate()}</span>
        </div>
        <div className="expense-right">
          <span className="expense-amount">₹{Number(exp.amount).toLocaleString('en-IN')}</span>
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Delete expense"
            aria-label="Delete expense"
          >
            <AiFillDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Items;
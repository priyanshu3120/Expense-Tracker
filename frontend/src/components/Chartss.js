import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { sortCategoryWise } from '../utils/seperator';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];

const COLORS = [
  { bg: 'rgba(34,197,94,0.75)',   border: '#22c55e' },
  { bg: 'rgba(59,130,246,0.75)',  border: '#3b82f6' },
  { bg: 'rgba(168,85,247,0.75)', border: '#a855f7' },
  { bg: 'rgba(245,158,11,0.75)', border: '#f59e0b' },
  { bg: 'rgba(239,68,68,0.75)',  border: '#ef4444' },
  { bg: 'rgba(236,72,153,0.75)', border: '#ec4899' },
  { bg: 'rgba(148,163,184,0.75)',border: '#94a3b8' },
];

export function Chartss(props) {
  const totalexp = sortCategoryWise(props.exdata, CATEGORIES);
  const hasData = totalexp.some(v => v > 0);

  const data = {
    labels: CATEGORIES,
    datasets: [{
      label: '₹ Spent',
      data: totalexp,
      backgroundColor: COLORS.map(c => c.bg),
      borderColor: COLORS.map(c => c.border),
      borderWidth: 2,
      hoverOffset: 12,
    }],
  };

  const options = {
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: { size: 12, family: 'Montserrat' },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,15,30,0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString('en-IN')}`,
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 800,
    },
  };

  if (!hasData) {
    return (
      <div className="chart-empty">
        <div className="chart-empty-icon">📊</div>
        <p className="chart-empty-text">No expenses yet</p>
        <p className="chart-empty-sub">Add your first expense to see your spending breakdown</p>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">Spending Breakdown</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
}

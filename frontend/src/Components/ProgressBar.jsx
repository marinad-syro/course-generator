import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ percentage, completedCount, totalCount, size = 'medium' }) => {
  return (
    <div className={`progress-container ${size}`}>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="progress-text">
        {completedCount}/{totalCount} lessons ({percentage}%)
      </span>
    </div>
  );
};

export default ProgressBar;

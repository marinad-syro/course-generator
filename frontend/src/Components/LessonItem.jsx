import React from 'react';
import { Link } from 'react-router-dom';
import './LessonItem.css';

const LessonItem = ({ lesson, area, module, isCompleted = false }) => {
  return (
    <Link
      to={`/lesson/${lesson.id}`}
      state={{
        area: area,
        module: module,
        lesson: lesson
      }}
      className={`lesson-item ${isCompleted ? 'completed' : ''}`}
    >
      <span className="lesson-name">{lesson.name}</span>
      {isCompleted && (
        <span className="completion-badge" title="Completed">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </Link>
  );
};

export default LessonItem;

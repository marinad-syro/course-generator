import React from 'react';
import { Link } from 'react-router-dom';
import './DropdownMenu.css';

const DropdownMenu = ({ items }) => {
  return (
    <div className="dropdown-menu">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.path ? (
              <Link to={item.path} onClick={item.onClick}>
                {item.label}
              </Link>
            ) : (
              <button onClick={item.onClick}>{item.label}</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;

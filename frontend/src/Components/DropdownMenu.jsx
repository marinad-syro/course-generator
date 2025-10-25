import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './DropdownMenu.css';

const DropdownMenu = ({ items, onClose }) => {
  const menuRef = useRef(null);
  const location = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target)
      ) {
        // Check if the click was on the menu button
        const menuButton = document.querySelector('.menu-icon');
        if (!menuButton || !menuButton.contains(event.target)) {
          onClose();
        }
      }
    }

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Close menu when location changes
  useEffect(() => {
    onClose();
  }, [location, onClose]);

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    onClose(); // Close the dropdown after clicking the item
  };

  return (
    <div className="dropdown-menu" ref={menuRef}>
      <ul>
        {items.map((item, index) => (
          <li key={index} className={`menu-item ${item.className || ''}`}>
            {item.path ? (
              <Link 
                to={item.path} 
                className="menu-link"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from bubbling up
                  handleItemClick(item);
                }}
              >
                {item.label}
              </Link>
            ) : (
              <button 
                className="menu-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from bubbling up
                  handleItemClick(item);
                }}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
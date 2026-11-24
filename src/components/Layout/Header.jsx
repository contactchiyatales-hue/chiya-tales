import React from 'react';
import '../../styles/layout.css';

export const Header = ({ onMenuToggle }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-nav-toggle"
          onClick={onMenuToggle}
          type="button"
          title="Toggle menu"
        >
          ☰
        </button>
        <h1 className="header-title">Chiya Tales</h1>
      </div>

      <div className="header-actions">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="header-view-menu-btn"
          title="View Live Public Menu"
        >
          <span>View Menu</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>

        <button className="notification-btn" title="Notifications" type="button">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="notification-badge">3</div>
        </button>
      </div>
    </header>
  );
};

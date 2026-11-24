import React from 'react';
import '../../styles/layout.css';

export const Sidebar = ({ activeTab, onTabChange, onLogout, isMobileOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'items', label: 'Menu Items' },
    { id: 'categories', label: 'Categories' },
    { id: 'settings', label: 'Header Settings' },
    { id: 'password', label: 'Change Password' },
    { id: 'support', label: 'Support' }
  ];

  return (
    <>
      <div
        className={`sidebar-backdrop ${isMobileOpen ? 'show' : ''}`}
        onClick={onClose}
        id="sidebarBackdrop"
      />

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`} id="appSidebar">
        <div className="sidebar-brand">
          <div>
            <h1 className="brand-title">Chiya Tale</h1>
            <span className="brand-sub">Admin Panel</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            type="button"
            title="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              role="button"
              tabIndex={0}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '11px' }}
            onClick={onLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

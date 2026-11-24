import React, { useState, useEffect } from 'react';
import '../../styles/dashboard.css';

export const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    categoriesCount: 0,
    itemsCount: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      if (data && data.categories) {
        const catCount = data.categories.length;
        let itemCount = 0;
        data.categories.forEach((cat) => {
          if (cat.items && Array.isArray(cat.items)) {
            itemCount += cat.items.length;
          }
        });
        setStats({ categoriesCount: catCount, itemsCount: itemCount, loading: false });
      } else {
        setStats({ categoriesCount: 5, itemsCount: 48, loading: false });
      }
    } catch (err) {
      setStats({ categoriesCount: 5, itemsCount: 48, loading: false });
    }
  };

  const actionCards = [
    {
      id: 'items',
      title: 'Menu Items',
      subtitle: 'Edit item names, prices & details',
      badge: `${stats.itemsCount} Items`,
      badgeColor: '#7A1F2C',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A1F2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      id: 'categories',
      title: 'Categories',
      subtitle: 'Manage sections, formats & images',
      badge: `${stats.categoriesCount} Sections`,
      badgeColor: '#0D3B34',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D3B34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1"></rect>
        </svg>
      )
    },
    {
      id: 'settings',
      title: 'Header Settings',
      subtitle: 'Taglines, café title & location',
      badge: 'Branding',
      badgeColor: '#A9762F',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A9762F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      )
    },
    {
      id: 'password',
      title: 'Change Password',
      subtitle: 'Update credentials & security',
      badge: 'Security',
      badgeColor: '#4F5D4B',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F5D4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      id: 'support',
      title: 'Support & Help',
      subtitle: 'WhatsApp assistance & user guide',
      badge: 'Helpdesk',
      badgeColor: '#7A1F2C',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A1F2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Dashboard Hero Banner Image */}
      <div className="welcome-banner">
        <img src="/uploads/dashboard/hero-session-image.jpeg" alt="Chiya Tale Dashboard Hero" className="hero-banner-img" />
      </div>

      {/* Quick Summary KPIs (Only Categories and Menu Items) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Categories</div>
          <div className="kpi-value">{stats.loading ? '...' : stats.categoriesCount}</div>
          <div className="kpi-sub">Active Sections</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Total Items</div>
          <div className="kpi-value">{stats.loading ? '...' : stats.itemsCount}</div>
          <div className="kpi-sub">Live Products</div>
        </div>
      </div>

      {/* Main Action Cards Grid */}
      <div className="section-header">
        <h2 className="section-title">Management Modules</h2>
        <p className="section-sub">Select a module to edit live menu configuration</p>
      </div>

      <div className="action-grid">
        {actionCards.map((card) => (
          <div
            key={card.id}
            className="action-card"
            onClick={() => onNavigate(card.id)}
          >
            <div className="action-card-header">
              <div className="action-icon-box" style={{ background: `${card.badgeColor}12` }}>
                {card.icon}
              </div>
              <span className="action-badge" style={{ color: card.badgeColor, background: `${card.badgeColor}15` }}>
                {card.badge}
              </span>
            </div>

            <div className="action-card-body">
              <h3 className="action-card-title">{card.title}</h3>
              <p className="action-card-sub">{card.subtitle}</p>
            </div>

            <div className="action-card-footer">
              <span className="action-link-text">Open Module</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="action-arrow">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

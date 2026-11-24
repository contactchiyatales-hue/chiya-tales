import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MenuItemsEditor } from './components/MenuItems/MenuItemsEditor';
import { CategoryManager } from './components/Categories/CategoryManager';
import { HeaderSettings } from './components/Settings/HeaderSettings';
import { PasswordChanger } from './components/Auth/PasswordChanger';
import { SupportView } from './components/Support/SupportView';
import './styles/index.css';
import './styles/layout.css';
import './styles/forms.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    handleInitialHashRoute();
  }, []);

  const handleInitialHashRoute = () => {
    const hash = window.location.hash.replace('#tab-', '').replace('#', '');
    const validTabs = ['dashboard', 'items', 'categories', 'settings', 'password', 'support'];
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('chiyatale_admin_token') || localStorage.getItem('adminToken');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      if (response.ok && data.valid) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('chiyatale_admin_token');
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    } catch (e) {
      // Offline fallback check: if token exists assume valid
      setIsAuthenticated(!!token);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    showToast('Logged in successfully!');
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('chiyatale_admin_token') || localStorage.getItem('adminToken');
    if (token) {
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } catch (e) {}
    }
    localStorage.removeItem('chiyatale_admin_token');
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    showToast('Logged out successfully');
  };

  const showToast = (message, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = `tab-${tabId}`;
    setIsMobileSidebarOpen(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F7F3E9', color: '#7A2430', fontWeight: 600, fontFamily: 'sans-serif' }}>
        Loading Chiya Tale Admin...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} onError={(err) => showToast(err.message, 5000)} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="app-main">
        <Header onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="view-content active" id="tab-dashboard">
            <Dashboard onNavigate={handleTabChange} />
          </div>
        )}

        {/* Menu Items */}
        {activeTab === 'items' && (
          <div className="view-content active" id="tab-items">
            <MenuItemsEditor onSave={(msg) => showToast(msg)} />
          </div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && (
          <div className="view-content active" id="tab-categories">
            <CategoryManager onSave={(msg) => showToast(msg)} onNotify={showToast} />
          </div>
        )}

        {/* Header Settings */}
        {activeTab === 'settings' && (
          <div className="view-content active" id="tab-settings">
            <HeaderSettings onSave={(msg) => showToast(msg)} />
          </div>
        )}

        {/* Change Password */}
        {activeTab === 'password' && (
          <div className="view-content active" id="tab-password">
            <PasswordChanger onSuccess={(msg) => showToast(msg)} onError={(err) => showToast(err.message, 5000)} />
          </div>
        )}

        {/* Support */}
        {activeTab === 'support' && (
          <div className="view-content active" id="tab-support">
            <SupportView />
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="toast show">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

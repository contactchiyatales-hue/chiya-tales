import React, { useState } from 'react';
import '../../styles/auth.css';

export const PasswordChanger = ({ onSuccess, onError }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('chiyatale_admin_token') || localStorage.getItem('adminToken') || '';
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to change password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess?.('Password changed successfully');
    } catch (err) {
      setError(err.message || 'Password change failed');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ label, value, onChange, type, onToggleVisibility }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', color: '#8B2332', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', background: '#F7F4EE', border: '1px solid #ECE5DB', borderRadius: '14px', padding: '10px 14px', transition: 'border-color 0.2s ease' }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0D3B34"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginRight: 10 }}
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input
          type={type === 'password' ? 'password' : 'text'}
          value={value}
          onChange={onChange}
          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#0D3B34', fontFamily: 'inherit' }}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#58746E', padding: 0, display: 'flex', alignItems: 'center' }}
          title="Toggle Password Visibility"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ background: '#FFFDF9', border: '1px solid #ECE5DB', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ background: '#FDF2F2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>{error}</div>}

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type={showPasswords.current ? 'text' : 'password'}
            onToggleVisibility={() => toggleVisibility('current')}
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type={showPasswords.new ? 'text' : 'password'}
            onToggleVisibility={() => toggleVisibility('new')}
          />

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showPasswords.confirm ? 'text' : 'password'}
            onToggleVisibility={() => toggleVisibility('confirm')}
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

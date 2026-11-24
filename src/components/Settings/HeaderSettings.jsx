import React, { useState, useEffect } from 'react';
import '../../styles/forms.css';

export const HeaderSettings = ({ onSave }) => {
  const [menuPayload, setMenuPayload] = useState({ header: {}, categories: [] });
  const [headerForm, setHeaderForm] = useState({
    eyebrow: '',
    title: '',
    sub: '',
    loc: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      if (data) {
        setMenuPayload(data);
        setHeaderForm({
          eyebrow: data.header?.eyebrow || 'Est. in Kathmandu',
          title: data.header?.title || 'Chiya Tale',
          sub: data.header?.sub || 'Specialty teas, fresh coffee, momos, pakaudas & delights',
          loc: data.header?.loc || 'Kathmandu, Nepal'
        });
      }
    } catch (error) {
      console.error('Failed to fetch header settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHeaderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedPayload = {
        ...menuPayload,
        header: {
          ...menuPayload.header,
          ...headerForm
        }
      };

      const token = localStorage.getItem('chiyatale_admin_token') || localStorage.getItem('adminToken') || '';
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPayload)
      });

      const data = await response.json();
      if (response.ok && data.success !== false) {
        setMenuPayload(updatedPayload);
        onSave?.('Branding & Header settings saved successfully!');
      } else {
        alert(data.error || 'Failed to save header settings');
      }
    } catch (error) {
      console.error('Failed to save header settings:', error);
      alert('Network error while saving header settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading header settings...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Header & Branding Settings</h2>
          <p className="card-sub">Customize café title, tagline, description & location</p>
        </div>
      </div>

      <div className="form-group">
        <label>Eyebrow / Tagline</label>
        <input
          type="text"
          className="form-control"
          name="eyebrow"
          value={headerForm.eyebrow}
          onChange={handleInputChange}
          placeholder="e.g. Est. in Kathmandu"
        />
      </div>

      <div className="form-group">
        <label>Restaurant Title / Brand Name</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={headerForm.title}
          onChange={handleInputChange}
          placeholder="e.g. Chiya Tale"
        />
      </div>

      <div className="form-group">
        <label>Sub-Tagline / Description</label>
        <textarea
          className="form-control"
          name="sub"
          rows="3"
          value={headerForm.sub}
          onChange={handleInputChange}
          placeholder="e.g. Specialty teas, fresh coffee, momos..."
        />
      </div>

      <div className="form-group">
        <label>Location Text</label>
        <input
          type="text"
          className="form-control"
          name="loc"
          value={headerForm.loc}
          onChange={handleInputChange}
          placeholder="e.g. Kathmandu, Nepal"
        />
      </div>

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Branding Settings'}
        </button>
      </div>
    </div>
  );
};

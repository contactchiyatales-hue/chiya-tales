import React, { useState, useEffect } from 'react';
import '../../styles/forms.css';

export const MenuItemsEditor = ({ onSave }) => {
  const [menuPayload, setMenuPayload] = useState({ header: {}, categories: [] });
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);
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
      if (data && data.categories) {
        setMenuPayload(data);
      } else if (Array.isArray(data)) {
        setMenuPayload({ header: {}, categories: data });
      }
    } catch (error) {
      console.error('Failed to fetch menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCatIndex(parseInt(e.target.value, 10));
  };

  const handleItemChange = (itemIdx, field, value) => {
    const updatedCategories = [...menuPayload.categories];
    const currentCat = { ...updatedCategories[selectedCatIndex] };
    const updatedItems = [...(currentCat.items || [])];
    updatedItems[itemIdx] = { ...updatedItems[itemIdx], [field]: value };
    currentCat.items = updatedItems;
    updatedCategories[selectedCatIndex] = currentCat;
    setMenuPayload({ ...menuPayload, categories: updatedCategories });
  };

  const handleAddItem = () => {
    if (!menuPayload.categories.length) return;
    const updatedCategories = [...menuPayload.categories];
    const currentCat = { ...updatedCategories[selectedCatIndex] };
    const updatedItems = [...(currentCat.items || [])];
    updatedItems.push({ name: '', price: '', desc: '' });
    currentCat.items = updatedItems;
    updatedCategories[selectedCatIndex] = currentCat;
    setMenuPayload({ ...menuPayload, categories: updatedCategories });
  };

  const handleRemoveItem = (itemIdx) => {
    const updatedCategories = [...menuPayload.categories];
    const currentCat = { ...updatedCategories[selectedCatIndex] };
    const updatedItems = currentCat.items.filter((_, idx) => idx !== itemIdx);
    currentCat.items = updatedItems;
    updatedCategories[selectedCatIndex] = currentCat;
    setMenuPayload({ ...menuPayload, categories: updatedCategories });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('chiyatale_admin_token') || localStorage.getItem('adminToken') || '';
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menuPayload)
      });

      const data = await response.json();
      if (response.ok && data.success !== false) {
        onSave?.('Menu items saved successfully!');
      } else {
        alert(data.error || 'Failed to save items');
      }
    } catch (error) {
      console.error('Failed to save items:', error);
      alert('Network error while saving items');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading menu items...</div>;

  const currentCategory = menuPayload.categories[selectedCatIndex] || { items: [] };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Menu Items & Pricing</h2>
          <p className="card-sub">Edit item names, prices, and descriptions</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleAddItem}>
          + Add New Item
        </button>
      </div>

      <div className="form-group">
        <label style={{ fontWeight: 600 }}>Select Category:</label>
        <select
          className="form-control"
          value={selectedCatIndex}
          onChange={handleCategoryChange}
        >
          {menuPayload.categories.map((cat, idx) => (
            <option key={idx} value={idx}>
              {cat.number ? `${cat.number} - ` : ''}{cat.title || `Category ${idx + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div id="itemsContainer" style={{ marginTop: '16px' }}>
        {currentCategory.items && currentCategory.items.length > 0 ? (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Item Name</th>
                  <th style={{ width: '25%' }}>Price (Rs.)</th>
                  <th style={{ width: '25%' }}>Description / Note</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentCategory.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.name || ''}
                        placeholder="e.g. Milk Chiya"
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        style={{ marginBottom: 0 }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.price || ''}
                        placeholder="e.g. 40"
                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                        style={{ marginBottom: 0 }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.desc || ''}
                        placeholder="e.g. Spiced milk tea"
                        onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                        style={{ marginBottom: 0 }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveItem(idx)}
                        title="Delete item"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', background: '#FAF6EF', borderRadius: '8px', color: '#58746E' }}>
            No items in this category yet. Click <strong>+ Add New Item</strong> to add one.
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={handleAddItem}>
          + Add New Item
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save All Items'}
        </button>
      </div>
    </div>
  );
};

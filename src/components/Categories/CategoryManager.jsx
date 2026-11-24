import React, { useState, useEffect } from 'react';
import '../../styles/forms.css';

export const CategoryManager = ({ onSave, onNotify }) => {
  const [menuPayload, setMenuPayload] = useState({ header: {}, categories: [] });
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const displayFormats = [
    { value: 'list', label: 'Standard Item List' },
    { value: 'specials_table', label: 'Specials Table (Full / Half)' },
    { value: 'momo_table', label: 'Momo Table (Steam, Fried, etc.)' },
    { value: 'hard_drinks_table', label: 'Hard Drinks Table (Bottle / Glass)' },
    { value: 'beer_table', label: 'Beer Table (Bottle / Can)' }
  ];

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
      console.error('Failed to fetch menu categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFieldChange = (field, value) => {
    const updatedCategories = [...menuPayload.categories];
    if (!updatedCategories[selectedCatIndex]) return;
    updatedCategories[selectedCatIndex] = {
      ...updatedCategories[selectedCatIndex],
      [field]: value
    };
    setMenuPayload({ ...menuPayload, categories: updatedCategories });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        const token = localStorage.getItem('chiyatale_admin_token') || localStorage.getItem('adminToken') || '';
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ imageData: base64Data })
        });

        const data = await response.json();
        if (response.ok && data.imageUrl) {
          handleCategoryFieldChange('image', data.imageUrl);
          onNotify?.('Header image uploaded successfully!');
        } else {
          onNotify?.(data.error || 'Image upload failed', 'error');
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload image:', error);
      onNotify?.('Image upload failed', 'error');
      setUploading(false);
    }
  };

  const handleAddCategory = () => {
    const nextNum = String(menuPayload.categories.length + 1).padStart(2, '0');
    const newCat = {
      number: nextNum,
      title: 'NEW CATEGORY',
      type: 'list',
      image: '',
      items: []
    };
    const updatedCategories = [...menuPayload.categories, newCat];
    setMenuPayload({ ...menuPayload, categories: updatedCategories });
    setSelectedCatIndex(updatedCategories.length - 1);
    onNotify?.('New category added. Don\'t forget to save changes.');
  };

  const handleDeleteCategory = () => {
    if (menuPayload.categories.length <= 1) {
      alert('You must keep at least one category!');
      return;
    }

    const catTitle = menuPayload.categories[selectedCatIndex]?.title || 'this category';
    if (!window.confirm(`Are you sure you want to delete "${catTitle}"?`)) return;

    const updatedCategories = menuPayload.categories.filter((_, idx) => idx !== selectedCatIndex);
    setMenuPayload({ ...menuPayload, categories: updatedCategories });
    setSelectedCatIndex(Math.max(0, selectedCatIndex - 1));
    onNotify?.('Category deleted.');
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
        onSave?.('Categories updated and saved successfully!');
      } else {
        alert(data.error || 'Failed to save categories');
      }
    } catch (error) {
      console.error('Failed to save categories:', error);
      alert('Network error while saving categories');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading categories...</div>;

  const activeCategory = menuPayload.categories[selectedCatIndex] || {
    number: '',
    title: '',
    type: 'list',
    image: ''
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Category Settings</h2>
          <p className="card-sub">Manage menu section titles, numbers, formats, and header images</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleAddCategory}>
          + Add Category
        </button>
      </div>

      <div className="form-group">
        <label style={{ fontWeight: 600 }}>Active Category to Edit:</label>
        <select
          className="form-control"
          value={selectedCatIndex}
          onChange={(e) => setSelectedCatIndex(parseInt(e.target.value, 10))}
        >
          {menuPayload.categories.map((cat, idx) => (
            <option key={idx} value={idx}>
              {cat.number ? `${cat.number} - ` : ''}{cat.title || `Category ${idx + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Section Number</label>
        <input
          type="text"
          className="form-control"
          value={activeCategory.number || ''}
          onChange={(e) => handleCategoryFieldChange('number', e.target.value)}
          placeholder="e.g. 01, 02"
        />
      </div>

      <div className="form-group">
        <label>Category Title</label>
        <input
          type="text"
          className="form-control"
          value={activeCategory.title || ''}
          onChange={(e) => handleCategoryFieldChange('title', e.target.value)}
          placeholder="e.g. CHIYA, COFFEE, MOMO"
        />
      </div>

      <div className="form-group">
        <label>Display Format</label>
        <select
          className="form-control"
          value={activeCategory.type || 'list'}
          onChange={(e) => handleCategoryFieldChange('type', e.target.value)}
        >
          {displayFormats.map((fmt) => (
            <option key={fmt.value} value={fmt.value}>
              {fmt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Header Image URL</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            value={activeCategory.image || ''}
            onChange={(e) => handleCategoryFieldChange('image', e.target.value)}
            placeholder="e.g. /uploads/momo.jpg or Cloudinary URL"
            style={{ flex: 1, marginBottom: 0 }}
          />
          <input
            type="file"
            id="catImageFileInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => document.getElementById('catImageFileInput').click()}
            disabled={uploading}
            style={{ whiteSpace: 'nowrap' }}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
        {activeCategory.image && (
          <div style={{ marginTop: '10px' }}>
            <img
              src={activeCategory.image}
              alt="Category Preview"
              style={{ maxHeight: '80px', borderRadius: '8px', border: '1px solid #ECE5DB' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-danger btn-sm" onClick={handleDeleteCategory}>
          Delete Category
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={handleAddCategory}>
            + Add Category
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Category Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

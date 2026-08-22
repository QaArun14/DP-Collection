import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

export default function ReviewModal({ isOpen, onClose, onSave, reviewToEdit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    city: 'Agra, UP',
    rating: 5,
    verified: true,
    review: '',
    productName: '',
    date: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  });

  useEffect(() => {
    if (reviewToEdit) {
      setFormData(reviewToEdit);
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        city: 'Agra, UP',
        rating: 5,
        verified: true,
        review: '',
        productName: 'Gulmohar Jaipuri Handblock Mulmul Kurti',
        date: 'Today',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
      });
    }
  }, [reviewToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.review.trim()) {
      alert('Please fill customer name and review comment.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-cream)'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1c1917' }}>
            {reviewToEdit ? 'Edit Customer Review' : 'Add New Customer Review'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Customer Name *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Radhika Agarwal"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Customer City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Agra, Uttar Pradesh"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Product Reviewed
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. Noor Chanderi Silk Anarkali"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Rating Stars (1 to 5)
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem', backgroundColor: '#fff' }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
              </select>
            </div>
          </div>

          <ImageUploadField
            label="Customer Photo / Avatar"
            value={formData.avatar}
            onChange={(img) => setFormData((prev) => ({ ...prev, avatar: img }))}
            aspectRatio="square"
          />

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
              Customer Review / Feedback Text *
            </label>
            <textarea
              required
              name="review"
              rows={3}
              value={formData.review}
              onChange={handleChange}
              placeholder="e.g. Excellent fabric quality and fast delivery in Agra! The fit is perfect."
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <input
              type="checkbox"
              id="verifiedReview"
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
            />
            <label htmlFor="verifiedReview" style={{ fontSize: '0.82rem', color: '#44403c', cursor: 'pointer' }}>
              Mark as <strong>Verified Buyer</strong> (Shows green checkmark)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e7dfd5' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '6px 20px', fontSize: '0.82rem' }}>
              Save Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

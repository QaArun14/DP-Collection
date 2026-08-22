import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

export default function InstaPostModal({ isOpen, onClose, onSave, postToEdit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: null,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    handle: '@durgesh_style',
    likes: '1.2k',
    product: 'Gulmohar Handblock Kurti'
  });

  useEffect(() => {
    if (postToEdit) {
      setFormData(postToEdit);
    } else {
      setFormData({
        id: Date.now(),
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        handle: '@priya_fashion',
        likes: '1.5k',
        product: 'Gulmohar Handblock Kurti'
      });
    }
  }, [postToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.image.trim() || !formData.handle.trim()) {
      alert('Please select/upload an image and enter an Instagram handle.');
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
          maxWidth: '520px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Camera size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1c1917' }}>
              {postToEdit ? 'Edit Lookbook Photo' : 'Add Instagram Lookbook Photo'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <ImageUploadField
            label="Lookbook Photo *"
            value={formData.image}
            onChange={(img) => setFormData((prev) => ({ ...prev, image: img }))}
            aspectRatio="portrait"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Instagram Handle *
              </label>
              <input
                type="text"
                required
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                placeholder="@username"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Likes Display
              </label>
              <input
                type="text"
                name="likes"
                value={formData.likes}
                onChange={handleChange}
                placeholder="e.g. 1.8k"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
              Wearing Product Name
            </label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="e.g. Noor Chanderi Silk Anarkali"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e7dfd5' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '6px 20px', fontSize: '0.82rem' }}>
              Save Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

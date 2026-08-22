import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import ImageUploadField from './ImageUploadField';

export default function ProductModal({ isOpen, onClose, onSave, productToEdit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: 'straight',
    tag: 'New Arrival',
    badgeColor: 'bg-rose-900',
    price: 1299,
    originalPrice: 2499,
    discount: '48% OFF',
    rating: 4.8,
    reviewCount: 45,
    fabric: '100% Pure Mulmul Cotton',
    craft: 'Jaipuri Handblock Print',
    fit: 'Straight Regular Fit',
    neckline: 'V-Neck with Gota Patti',
    sleeves: '3/4th Sleeves',
    stock: 10,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    primaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    description: '',
    washCare: 'Gentle hand wash in cold water with mild detergent.',
    isFeatured: false,
    colors: [
      { name: 'Maroon', hex: '#881337', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' }
    ]
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        category: 'straight',
        tag: 'New Arrival',
        badgeColor: 'bg-rose-900',
        price: 1299,
        originalPrice: 2499,
        discount: '48% OFF',
        rating: 4.8,
        reviewCount: 1,
        fabric: '100% Pure Cotton',
        craft: 'Handblock Print',
        fit: 'Straight Regular Fit',
        neckline: 'Round Neck',
        sleeves: '3/4th Sleeves',
        stock: 12,
        sizes: ['S', 'M', 'L', 'XL'],
        primaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        secondaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        description: 'Handcrafted luxury ethnic kurti crafted from breathable pure cotton fabric.',
        washCare: 'Hand wash in cold water.',
        isFeatured: false,
        colors: [
          { name: 'Red', hex: '#881337', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' }
        ]
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'originalPrice' || name === 'stock') {
      const numVal = Number(value) || 0;
      setFormData((prev) => {
        const updated = { ...prev, [name]: numVal };
        if (name === 'price' || name === 'originalPrice') {
          const p = name === 'price' ? numVal : prev.price;
          const op = name === 'originalPrice' ? numVal : prev.originalPrice;
          if (op > p && op > 0) {
            const discPercent = Math.round(((op - p) / op) * 100);
            updated.discount = `${discPercent}% OFF`;
          }
        }
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const newSizes = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }
    onSave(formData);
    onClose();
  };

  const allAvailableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '840px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-cream)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1c1917' }}>
              {productToEdit ? 'Edit Kurti Product' : 'Add New Kurti to Catalog'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Product Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Gulmohar Jaipuri Handblock Mulmul Kurti"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Category Silhouette
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem', backgroundColor: '#fff' }}
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Badge / Tag */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Promo Tag (e.g. Bestseller, Trending, Festive Pick)
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Selling Price */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            {/* MRP / Original Price */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Original MRP (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Stock Count */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Stock Available (pieces)
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Fabric Material */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Fabric (e.g. 100% Mulmul Cotton, Chanderi Silk)
              </label>
              <input
                type="text"
                name="fabric"
                value={formData.fabric}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Craft Technique */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Craft / Print (e.g. Jaipuri Handblock, Lucknowi Chikankari)
              </label>
              <input
                type="text"
                name="craft"
                value={formData.craft}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            {/* Neckline & Fit */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Neckline & Fit
              </label>
              <input
                type="text"
                name="neckline"
                value={formData.neckline}
                onChange={handleChange}
                placeholder="e.g. V-Neck with Gota Patti"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Sizes Selection Chips */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
              Available Sizes:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allAvailableSizes.map((size) => {
                const isSelected = formData.sizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleToggleSize(size)}
                    style={{
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid #d6d3d1',
                      backgroundColor: isSelected ? 'rgba(128,0,32,0.1)' : '#ffffff',
                      color: isSelected ? 'var(--color-primary)' : '#44403c',
                      fontWeight: isSelected ? 800 : 500,
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {size} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload from Device & Live Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <ImageUploadField
              label="Primary Product Photo *"
              value={formData.primaryImage}
              onChange={(imgUrl) => setFormData((prev) => ({ ...prev, primaryImage: imgUrl }))}
              aspectRatio="portrait"
            />

            <ImageUploadField
              label="Secondary Photo (Hover / Back look)"
              value={formData.secondaryImage}
              onChange={(imgUrl) => setFormData((prev) => ({ ...prev, secondaryImage: imgUrl }))}
              aspectRatio="portrait"
            />
          </div>

          {/* Description & Wash Care */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
              Product Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
            />
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e7dfd5' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 24px', fontSize: '0.85rem' }}
            >
              {productToEdit ? 'Save Changes' : 'Publish Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

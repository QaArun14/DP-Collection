import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Sparkles, Image as ImageIcon, Check, Info } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import ImageUploadField from './ImageUploadField';

const TOTAL_PHOTO_SLOTS = 6;

const SLOT_CONFIGS = [
  {
    id: 0,
    title: '👑 Slot 1: Primary Cover Photo *',
    required: true,
    desc: 'Main image displayed in catalog, search results, and hero previews.',
    placeholder: 'Primary catalog cover photo'
  },
  {
    id: 1,
    title: '📸 Slot 2: Back / Second Angle Look',
    required: false,
    desc: 'Shown on catalog card hover and as secondary zoom angle.',
    placeholder: 'Back or alternate angle shot'
  },
  {
    id: 2,
    title: '🧵 Slot 3: Fabric & Texture Close-up',
    required: false,
    desc: 'Close-up showing weave, cotton mulmul softness, or silk sheen.',
    placeholder: 'Fabric texture detail photo'
  },
  {
    id: 3,
    title: '✨ Slot 4: Neckline, Zari & Embroidery',
    required: false,
    desc: 'Highlights intricate neckline, gota patti work, or buttons.',
    placeholder: 'Neckline & artisan embroidery shot'
  },
  {
    id: 4,
    title: '👗 Slot 5: Full Length Flare & Hemline',
    required: false,
    desc: 'Displays the silhouette, anarkali flare, or side slits.',
    placeholder: 'Full silhouette & bottom flare view'
  },
  {
    id: 5,
    title: '💃 Slot 6: Model Styling & Lookbook',
    required: false,
    desc: 'Lifestyle styling with dupatta, jewelry, or palazzo set.',
    placeholder: 'Full ensemble & lookbook photo'
  }
];

export default function ProductModal({ isOpen, onClose, onSave, productToEdit }) {
  if (!isOpen) return null;

  // Exactly 6 fixed photo slots state
  const [images, setImages] = useState(() => Array(TOTAL_PHOTO_SLOTS).fill(''));

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
    primaryImage: '',
    secondaryImage: '',
    description: '',
    washCare: 'Gentle hand wash in cold water with mild detergent.',
    isFeatured: false,
    colors: [
      { name: 'Maroon', hex: '#881337', image: '' }
    ]
  });

  useEffect(() => {
    if (productToEdit) {
      let existingImgs = [];
      if (Array.isArray(productToEdit.images) && productToEdit.images.length > 0) {
        existingImgs = productToEdit.images;
      } else {
        existingImgs = [productToEdit.primaryImage, productToEdit.secondaryImage].filter(Boolean);
      }

      // Pad up to exactly 6 slots
      const paddedImgs = Array(TOTAL_PHOTO_SLOTS).fill('').map((_, idx) => existingImgs[idx] || '');
      setImages(paddedImgs);

      setFormData({
        ...productToEdit,
        category: (productToEdit.category || 'straight').toLowerCase(),
        sizes: Array.isArray(productToEdit.sizes) && productToEdit.sizes.length > 0 ? productToEdit.sizes : ['S', 'M', 'L', 'XL'],
        colors: Array.isArray(productToEdit.colors) && productToEdit.colors.length > 0 ? productToEdit.colors : [{ name: 'Standard', hex: '#881337', image: paddedImgs[0] || '' }],
        price: Number(productToEdit.price) || 1299,
        originalPrice: Number(productToEdit.originalPrice) || 2499,
        stock: Number(productToEdit.stock) || 10
      });
    } else {
      const defaultSampleImgs = [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        '',
        '',
        '',
        ''
      ];
      setImages(defaultSampleImgs);

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
        description: 'Handcrafted luxury ethnic kurti crafted from breathable pure cotton fabric.',
        washCare: 'Hand wash in cold water.',
        isFeatured: false,
        colors: [
          { name: 'Red', hex: '#881337', image: defaultSampleImgs[0] }
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
      const currentSizes = Array.isArray(prev.sizes) ? prev.sizes : [];
      const exists = currentSizes.includes(size);
      const newSizes = exists ? currentSizes.filter((s) => s !== size) : [...currentSizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  // Image Slot Handlers (6 slots)
  const handleSlotImageChange = (slotIndex, newUrl) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[slotIndex] = newUrl;
      return updated;
    });
  };

  const handleClearSlot = (slotIndex) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[slotIndex] = '';
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    // Collect all filled non-empty image slots
    const filledImages = images.filter((img) => img && typeof img === 'string' && img.trim() !== '');
    if (filledImages.length === 0) {
      alert('Please upload or enter at least Slot 1 (Primary Cover Photo).');
      return;
    }

    const payload = {
      ...formData,
      category: (formData.category || 'straight').toLowerCase(),
      sizes: Array.isArray(formData.sizes) && formData.sizes.length > 0 ? formData.sizes : ['S', 'M', 'L', 'XL'],
      colors: Array.isArray(formData.colors) && formData.colors.length > 0 ? formData.colors : [{ name: 'Standard', hex: '#881337', image: filledImages[0] }],
      images: filledImages,
      primaryImage: filledImages[0],
      secondaryImage: filledImages[1] || filledImages[0],
      price: Number(formData.price) || 999,
      originalPrice: Number(formData.originalPrice) || Number(formData.price) * 2 || 1999,
      stock: Number(formData.stock) || 10
    };

    onSave(payload);
    onClose();
  };

  const allAvailableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
  const filledCount = images.filter((img) => img && typeof img === 'string' && img.trim() !== '').length;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200, padding: '16px' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fafaf9',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>👑</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {productToEdit ? 'Edit Kurti Product' : 'Add New Designer Kurti'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716c' }}>
                Manage catalog info & up to 6 designated photo slots ({filledCount} of 6 slots filled)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#78716c', cursor: 'pointer', padding: '4px' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Row 1: Name, Category, Tag */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Gulmohar Jaipuri Mulmul Kurti"
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Badge Tag
              </label>
              <input
                type="text"
                name="tag"
                placeholder="e.g. Bestseller / New Arrival"
                value={formData.tag}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Row 2: Price, Original Price, Discount, Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Selling Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Original MRP (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Discount Badge
              </label>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Stock Count
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Row 3: Fabric, Craft, Fit, Neckline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Fabric
              </label>
              <input
                type="text"
                name="fabric"
                value={formData.fabric}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Craft Technique
              </label>
              <input
                type="text"
                name="craft"
                value={formData.craft}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Fit Style
              </label>
              <input
                type="text"
                name="fit"
                value={formData.fit}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Neckline
              </label>
              <input
                type="text"
                name="neckline"
                value={formData.neckline}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Sizes Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '8px' }}>
              Available Sizes (Click to Toggle)
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allAvailableSizes.map((size) => {
                const isSelected = (formData.sizes || []).includes(size);
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
                      fontSize: '0.8rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {size} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6 DESIGNATED PRODUCT PICTURE SLOTS (ALL 6 SLOTS DIRECTLY VISIBLE & READY) */}
          {/* ========================================================================= */}
          <div
            style={{
              marginBottom: '22px',
              backgroundColor: '#fafaf9',
              borderRadius: '16px',
              padding: '18px',
              border: '1.5px solid #e7e5e4'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e7e5e4'
              }}
            >
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    color: '#1c1917',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ImageIcon size={19} color="var(--color-primary)" />
                  Product Picture Slots (6 Total Slots Available)
                </h4>
                <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#78716c' }}>
                  Aap jitni chahein utni pictures fill kar sakte hain (1 se lekar 6 tak). Slot 1 zaroori hai, baaki optional hain.
                </p>
              </div>

              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: filledCount > 0 ? 'var(--color-primary)' : '#78716c',
                  backgroundColor: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                }}
              >
                📸 {filledCount} / 6 Slots Filled
              </span>
            </div>

            {/* 6 Photo Slots Grid (2 columns on desktop, 1 on mobile) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
                gap: '16px'
              }}
            >
              {SLOT_CONFIGS.map((slot) => {
                const currentVal = images[slot.id] || '';
                const isSlotFilled = Boolean(currentVal && currentVal.trim());

                return (
                  <div
                    key={slot.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '14px',
                      border: slot.id === 0 ? '1.5px solid #d4af37' : isSlotFilled ? '1.5px solid #cbd5e1' : '1px dashed #d6d3d1',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Slot Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: slot.id === 0 ? '#92400e' : '#1c1917'
                        }}
                      >
                        {slot.title}
                      </span>

                      {isSlotFilled ? (
                        <button
                          type="button"
                          onClick={() => handleClearSlot(slot.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#fef2f2'
                          }}
                          title="Clear this photo"
                        >
                          <Trash2 size={12} /> Clear
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
                          {slot.id === 0 ? 'Required' : 'Optional'}
                        </span>
                      )}
                    </div>

                    <p style={{ margin: '0 0 10px', fontSize: '0.72rem', color: '#78716c', lineHeight: 1.3 }}>
                      {slot.desc}
                    </p>

                    <div style={{ marginTop: 'auto' }}>
                      <ImageUploadField
                        label=""
                        value={currentVal}
                        onChange={(newUrl) => handleSlotImageChange(slot.id, newUrl)}
                        aspectRatio="portrait"
                        helperText={slot.placeholder}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
              Product Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the silhouette, embroidery, occasion styling and craft heritage..."
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

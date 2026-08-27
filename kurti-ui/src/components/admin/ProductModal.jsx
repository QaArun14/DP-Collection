import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Sparkles, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import ImageUploadField from './ImageUploadField';

export default function ProductModal({ isOpen, onClose, onSave, productToEdit }) {
  if (!isOpen) return null;

  // Up to 6 product images state
  const [images, setImages] = useState(() => {
    if (productToEdit) {
      if (Array.isArray(productToEdit.images) && productToEdit.images.length > 0) {
        return productToEdit.images.slice(0, 6);
      }
      const fallback = [productToEdit.primaryImage, productToEdit.secondaryImage].filter(Boolean);
      return fallback.length > 0 ? fallback : [''];
    }
    return [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ];
  });

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
      { name: 'Maroon', hex: '#881337', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' }
    ]
  });

  useEffect(() => {
    if (productToEdit) {
      let initialImgs = [];
      if (Array.isArray(productToEdit.images) && productToEdit.images.length > 0) {
        initialImgs = productToEdit.images.slice(0, 6);
      } else {
        initialImgs = [productToEdit.primaryImage, productToEdit.secondaryImage].filter(Boolean);
      }
      if (initialImgs.length === 0) initialImgs = [''];
      setImages(initialImgs);
      setFormData({
        ...productToEdit,
        images: initialImgs,
        primaryImage: initialImgs[0] || productToEdit.primaryImage || '',
        secondaryImage: initialImgs[1] || productToEdit.secondaryImage || ''
      });
    } else {
      const defaultImgs = [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ];
      setImages(defaultImgs);
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
        images: defaultImgs,
        primaryImage: defaultImgs[0],
        secondaryImage: defaultImgs[1],
        description: 'Handcrafted luxury ethnic kurti crafted from breathable pure cotton fabric.',
        washCare: 'Hand wash in cold water.',
        isFeatured: false,
        colors: [
          { name: 'Red', hex: '#881337', image: defaultImgs[0] }
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

  // Image Slot Handlers (Max 6 slots)
  const handleImageChange = (index, newUrl) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = newUrl;
      return updated;
    });
  };

  const handleAddImageSlot = () => {
    if (images.length >= 6) {
      alert('You can add up to 6 pictures maximum per product.');
      return;
    }
    setImages((prev) => [...prev, '']);
  };

  const handleRemoveImageSlot = (index) => {
    if (images.length <= 1) {
      setImages(['']);
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }
    const cleanImages = images.filter((img) => img && typeof img === 'string' && img.trim() !== '');
    if (cleanImages.length === 0) {
      alert('Please add at least 1 primary product photo.');
      return;
    }

    const payload = {
      ...formData,
      images: cleanImages,
      primaryImage: cleanImages[0],
      secondaryImage: cleanImages[1] || cleanImages[0]
    };

    onSave(payload);
    onClose();
  };

  const allAvailableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

  const slotLabels = [
    'Photo 1: Primary Cover Photo * (Main Store & Catalog)',
    'Photo 2: Back / Angle View (Hover & Lookbook)',
    'Photo 3: Fabric Texture & Weave Detail',
    'Photo 4: Neckline, Zari & Gota Patti Work',
    'Photo 5: Full Length Flare & Styling Look',
    'Photo 6: Model Close-Up / Additional Angle'
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200, padding: '16px' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '860px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Header */}
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
            <span style={{ fontSize: '1.2rem' }}>👑</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {productToEdit ? 'Edit Kurti Product' : 'Add New Designer Kurti'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#78716c' }}>
                Manage catalog specs, pricing, sizes & up to 6 high-res photos
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

        {/* Form Body */}
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
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#44403c', marginBottom: '8px' }}>
              Available Sizes (Click to Toggle)
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

          {/* ======================================================== */}
          {/* MULTI-PHOTO GALLERY MANAGER (UP TO 6 PICTURE SLOTS)       */}
          {/* ======================================================== */}
          <div
            style={{
              marginBottom: '20px',
              backgroundColor: '#fafaf9',
              borderRadius: '14px',
              padding: '16px',
              border: '1.5px solid #e7e5e4'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
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
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#1c1917',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ImageIcon size={18} color="var(--color-primary)" />
                  Product Picture Slots ({images.length} of 6 active)
                </h4>
                <p style={{ margin: '3px 0 0', fontSize: '0.76rem', color: '#78716c' }}>
                  Add up to 6 high-resolution pictures. Photos can be uploaded from your device or pasted as web URLs.
                </p>
              </div>

              {/* Add Slot Button / Max Indicator */}
              {images.length < 6 ? (
                <button
                  type="button"
                  onClick={handleAddImageSlot}
                  style={{
                    backgroundColor: '#ffffff',
                    color: 'var(--color-primary)',
                    border: '1.5px solid var(--color-primary)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Plus size={15} /> Add Picture Slot ({images.length + 1} of 6)
                </button>
              ) : (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#059669',
                    backgroundColor: '#ecfdf5',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Check size={14} /> Max 6 Picture Slots Reached
                </span>
              )}
            </div>

            {/* Grid of Picture Slots (1 to 6) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px'
              }}
            >
              {images.map((imgUrl, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '12px',
                    border: index === 0 ? '1.5px solid #d4af37' : '1px solid #e7e5e4',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: index === 0 ? '#92400e' : '#292524',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {index === 0 && '👑'} {slotLabels[index] || `Photo Slot ${index + 1}`}
                    </span>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageSlot(index)}
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
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: '#fef2f2'
                        }}
                        title="Delete this photo slot"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>

                  <ImageUploadField
                    label=""
                    value={imgUrl}
                    onChange={(newUrl) => handleImageChange(index, newUrl)}
                    aspectRatio="portrait"
                    helperText={index === 0 ? 'Primary catalog photo' : `Gallery angle ${index + 1}`}
                  />
                </div>
              ))}
            </div>
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

import React, { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';

export default function CouponModal({ isOpen, onClose, onSave, couponToEdit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    code: '',
    discountPercent: 20,
    discountFlat: 0,
    minOrder: 999,
    description: 'Festive Discount'
  });
  const [discountType, setDiscountType] = useState('percent'); // 'percent' or 'flat'

  useEffect(() => {
    if (couponToEdit) {
      setFormData({
        code: couponToEdit.code,
        discountPercent: couponToEdit.discountPercent || 0,
        discountFlat: couponToEdit.discountFlat || 0,
        minOrder: couponToEdit.minOrder || 0,
        description: couponToEdit.description || ''
      });
      setDiscountType(couponToEdit.discountFlat ? 'flat' : 'percent');
    } else {
      setFormData({
        code: '',
        discountPercent: 15,
        discountFlat: 0,
        minOrder: 999,
        description: 'Special Discount'
      });
      setDiscountType('percent');
    }
  }, [couponToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase().trim() : Number(value) || (name === 'description' ? value : 0)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      alert('Please enter a coupon code.');
      return;
    }

    const payload = {
      code: formData.code,
      minOrder: Number(formData.minOrder) || 0,
      description: formData.description,
      ...(discountType === 'percent'
        ? { discountPercent: Number(formData.discountPercent) || 0 }
        : { discountFlat: Number(formData.discountFlat) || 0 })
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '480px',
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
            <Tag size={18} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1c1917' }}>
              {couponToEdit ? 'Edit Promo Coupon' : 'Create New Promo Coupon'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
              Coupon Code (e.g. AGRA20, FESTIVE30) *
            </label>
            <input
              type="text"
              required
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="AGRA25"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
              Discount Type:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDiscountType('percent')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: discountType === 'percent' ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                  backgroundColor: discountType === 'percent' ? 'rgba(128,0,32,0.08)' : '#fff',
                  fontWeight: discountType === 'percent' ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Percentage (% Off)
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('flat')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: discountType === 'flat' ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                  backgroundColor: discountType === 'flat' ? 'rgba(128,0,32,0.08)' : '#fff',
                  fontWeight: discountType === 'flat' ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Flat Amount (₹ Off)
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            {discountType === 'percent' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                  Discount Percent (%)
                </label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  min={1}
                  max={90}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
                />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                  Flat Discount (₹)
                </label>
                <input
                  type="number"
                  name="discountFlat"
                  value={formData.discountFlat}
                  onChange={handleChange}
                  min={1}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                Minimum Order Value (₹)
              </label>
              <input
                type="number"
                name="minOrder"
                value={formData.minOrder}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
              Description / Promo Title
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="e.g. Special 25% Festive Offer"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e7dfd5' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '6px 20px', fontSize: '0.82rem' }}>
              Save Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

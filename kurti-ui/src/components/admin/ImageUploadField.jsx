import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Check, Sparkles } from 'lucide-react';
import { uploadImageToBackend } from '../../utils/api';

/**
 * Compresses an image file using HTML5 Canvas to keep Base64 size small (< 150KB)
 * for smooth fallback persistence.
 */
const compressImageFile = (file, maxWidth = 900, maxHeight = 1200, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function ImageUploadField({
  label,
  value,
  onChange,
  aspectRatio = 'portrait', // 'portrait' (kurtis), 'square' (avatars)
  helperText = 'Upload high quality photo from your device or paste web link'
}) {
  const [mode, setMode] = useState('upload'); // 'upload' or 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const processAndUploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsProcessing(true);
      // 1. Try uploading to Backend Server Multer Storage
      const serverUrl = await uploadImageToBackend(file);
      if (serverUrl) {
        onChange(serverUrl);
        return;
      }

      // 2. If Backend Server is offline, fallback to client-side compressed base64
      const compressedDataUrl = await compressImageFile(file);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Error uploading image', err);
      alert('Failed to process image file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processAndUploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processAndUploadFile(file);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isSquare = aspectRatio === 'square';

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
          {label}
        </label>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              border: 'none',
              backgroundColor: mode === 'upload' ? '#ffffff' : 'transparent',
              color: mode === 'upload' ? 'var(--color-primary)' : '#64748b',
              fontWeight: mode === 'upload' ? 700 : 500,
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: mode === 'upload' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Upload size={12} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              border: 'none',
              backgroundColor: mode === 'url' ? '#ffffff' : 'transparent',
              color: mode === 'url' ? 'var(--color-primary)' : '#64748b',
              fontWeight: mode === 'url' ? 700 : 500,
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: mode === 'url' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <LinkIcon size={12} /> URL Link
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload / Drag-and-drop Dropzone */}
      {mode === 'upload' && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {value ? (
            /* Selected Image Preview with Change/Remove Button - Full Uncropped View */
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc'
              }}
            >
              <div
                style={{
                  width: isSquare ? '64px' : '72px',
                  height: isSquare ? '64px' : '92px',
                  borderRadius: isSquare ? '50%' : '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px'
                }}
              >
                <img
                  src={value}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={15} color="#16a34a" /> Image Ready (Full View)
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                  {value.startsWith('data:') ? 'Uploaded from device (compressed)' : value}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0052cc',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#ef4444',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                  title="Remove image"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone Box */
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed var(--color-primary)' : '2px dashed #cbd5e1',
                backgroundColor: isDragging ? 'rgba(128, 0, 32, 0.05)' : '#f8fafc',
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(128, 0, 32, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  color: 'var(--color-primary)'
                }}
              >
                <Upload size={18} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block' }}>
                {isProcessing ? 'Processing Photo...' : 'Click to Upload or Drag Photo Here'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                Supports JPG, PNG, WEBP from Computer / Mobile
              </span>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Web URL Input */}
      {mode === 'url' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or image link"
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#ef4444',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {value && (
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: isSquare ? '52px' : '52px',
                  height: isSquare ? '52px' : '68px',
                  borderRadius: isSquare ? '50%' : '6px',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px'
                }}
              >
                <img src={value} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Live Image URL Preview (Full View)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { setAdminLoggedIn } from '../../utils/storage';
import { apiAdminLogin } from '../../utils/api';

export default function AdminLogin({ onLoginSuccess, onBackToStore }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = await apiAdminLogin(username, password);
    if (res.success) {
      setAdminLoggedIn(true);
      onLoginSuccess();
    } else {
      setErrorMsg('Invalid Login ID or Password. Access denied.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-sans)',
        position: 'relative'
      }}
    >
      {/* Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(128, 0, 32, 0.4) 0%, rgba(0,0,0,0) 70%)',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '24px',
          maxWidth: '440px',
          width: '100%',
          padding: '40px 32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          border: '1px solid #334155',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            className="brand-emblem-shield"
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '16px'
            }}
          >
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <span className="brand-crown-icon" style={{ fontSize: '1rem', color: '#fef08a', display: 'block', marginBottom: '2px' }}>
                👑
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-royal)', color: '#ffffff', letterSpacing: '0.04em' }}>
                DC
              </span>
            </div>
          </div>

          <h2 className="brand-shimmer-gold" style={{ fontSize: '1.75rem', margin: '0 0 4px', letterSpacing: '0.06em' }}>
            DURGESH COLLECTION
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 800 }}>
              Royal Admin CMS Portal
            </span>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
            Sign in to manage kurtis, orders, reviews & cloud database
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.78rem',
              color: '#fca5a5',
              marginBottom: '20px',
              lineHeight: 1.4
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Admin Login ID / Email
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '10px 14px',
                gap: '10px'
              }}
            >
              <Mail size={17} color="#64748b" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@durgeshcollection.in"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>
                Password
              </label>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '10px 14px',
                gap: '10px'
              }}
            >
              <Lock size={17} color="#64748b" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  width: '100%'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.92rem',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Sign In to CMS Portal <ArrowRight size={16} />
          </button>
        </form>

        {/* Secure Access Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '0.75rem',
            marginBottom: '20px',
            padding: '8px',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            border: '1px solid #334155'
          }}
        >
          <ShieldCheck size={15} color="#10b981" />
          <span>Restricted Portal • Authorized Admin Personnel Only</span>
        </div>

        {/* Back to Storefront Link */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={onBackToStore}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s ease'
            }}
          >
            <ArrowLeft size={14} /> Back to Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
}

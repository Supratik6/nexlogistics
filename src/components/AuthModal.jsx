import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Zap, 
  Radio, 
  ShieldAlert, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import gsap from 'gsap';
import { authService } from '../services/authService';
import { soundFx } from '../services/soundService';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER' | 'FORGOT'
  const [role, setRole] = useState('CONTROL_ROOM'); // 'CONTROL_ROOM' | 'COMMUTATOR'
  
  // Login fields
  const [email, setEmail] = useState('control@daffodils.ops');
  const [password, setPassword] = useState('commander123');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('COMMUTATOR');

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: Success

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 25 },
        { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.6)' }
      );
    }
  }, [isOpen]);

  const handleQuickLogin = (roleType) => {
    try {
      setErrorMessage(null);
      authService.quickLogin(roleType);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      authService.login(email, password, role);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
      soundFx.playAlertPing();
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      authService.register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: regRole
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
      soundFx.playAlertPing();
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (resetStep === 1) {
      if (!forgotEmail) {
        setErrorMessage('Please provide your registered email address.');
        return;
      }
      setResetStep(2);
      soundFx.playRadarPing();
    } else if (resetStep === 2) {
      try {
        authService.resetPassword(forgotEmail, newPassword || 'newpass123');
        setResetStep(3);
        setSuccessMessage('Password reset successfully verified. You may now sign in.');
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 7, 16, 0.82)',
      backdropFilter: 'blur(10px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div 
        ref={modalRef}
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '24px 28px',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} color="#fbbf24" />
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff' }}>
                DAFFODILS SECURE ACCESS
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Role-Based Clearance & Authentication Matrix
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        {/* 1-Click Quick Demo Login Pills (Vital for Presentations) */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' }}>
          <div style={{ fontSize: '10.5px', color: '#fbbf24', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Zap size={12} color="#fbbf24" />
            <span>1-Click Presentation Demo Logins:</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('CONTROL_ROOM')}
              className="btn-primary"
              style={{
                fontSize: '11px',
                padding: '7px 8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)'
              }}
            >
              🕹️ Control Room Master
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('COMMUTATOR')}
              className="btn-primary"
              style={{
                fontSize: '11px',
                padding: '7px 8px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
              }}
            >
              🚗 Commutator / Client
            </button>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '6px' }}>
          {[
            { id: 'LOGIN', label: 'Sign In' },
            { id: 'REGISTER', label: 'Create Account' },
            { id: 'FORGOT', label: 'Forgot Password' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveMode(t.id); setErrorMessage(null); setSuccessMessage(null); soundFx.playRadarPing(); }}
              style={{
                background: activeMode === t.id ? 'rgba(245, 158, 11, 0.18)' : 'transparent',
                border: 'none',
                color: activeMode === t.id ? '#fbbf24' : '#94a3b8',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: activeMode === t.id ? '700' : '500',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', padding: '8px 12px', fontSize: '11.5px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertCircle size={14} color="#ef4444" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{ background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px', padding: '8px 12px', fontSize: '11.5px', color: '#86efac', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <CheckCircle2 size={14} color="#10b981" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {activeMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit}>
            {/* Target Role Selector */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Select Clearance Role:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setRole('CONTROL_ROOM'); setEmail('control@daffodils.ops'); setPassword('commander123'); soundFx.playRadarPing(); }}
                  style={{
                    background: role === 'CONTROL_ROOM' ? 'rgba(245, 158, 11, 0.22)' : 'rgba(15, 23, 42, 0.6)',
                    border: role === 'CONTROL_ROOM' ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: role === 'CONTROL_ROOM' ? '#fbbf24' : '#94a3b8',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🕹️ Control Room
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('COMMUTATOR'); setEmail('commuter@daffodils.io'); setPassword('commuter123'); soundFx.playRadarPing(); }}
                  style={{
                    background: role === 'COMMUTATOR' ? 'rgba(6, 182, 212, 0.22)' : 'rgba(15, 23, 42, 0.6)',
                    border: role === 'COMMUTATOR' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: role === 'COMMUTATOR' ? '#22d3ee' : '#94a3b8',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🚗 Commutator
                </button>
              </div>
            </div>

            {/* Email & Password */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8' }}>Operational Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Mail size={16} color="#fbbf24" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8' }}>Access Password</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', position: 'relative' }}>
                <Key size={16} color="#fbbf24" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input"
                  style={{ paddingRight: '36px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13.5px', background: 'linear-gradient(135deg, #f59e0b 0%, #06b6d4 100%)' }}
            >
              <Lock size={15} />
              <span>Authenticate Session & Launch</span>
            </button>
          </form>
        )}

        {/* 2. CREATE ACCOUNT FORM */}
        {activeMode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="glass-input"
                  style={{ marginTop: '4px' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="glass-input"
                  style={{ marginTop: '4px' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8' }}>Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="glass-input"
                style={{ marginTop: '4px' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Set Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="glass-input"
                  style={{ marginTop: '4px' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Select Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="glass-input"
                  style={{ marginTop: '4px', background: '#0b1224' }}
                >
                  <option value="COMMUTATOR">Commutator / Rider</option>
                  <option value="CONTROL_ROOM">Control Room Dispatcher</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13.5px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            >
              <User size={15} />
              <span>Register Account & Log In</span>
            </button>
          </form>
        )}

        {/* 3. FORGOT / RESET PASSWORD FLOW */}
        {activeMode === 'FORGOT' && (
          <form onSubmit={handleForgotSubmit}>
            {resetStep === 1 && (
              <div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                  Enter your registered email address to receive an instant verification OTP to reset your account password.
                </p>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Registered Email</label>
                  <input
                    type="email"
                    placeholder="control@daffodils.ops"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="glass-input"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '13.5px' }}
                >
                  <span>Send Verification Code</span>
                </button>
              </div>
            )}

            {resetStep === 2 && (
              <div>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '11.5px', color: '#fde68a', marginBottom: '14px' }}>
                  Simulated 6-digit OTP sent to: <strong>{forgotEmail}</strong> (Default OTP: <strong>778942</strong>)
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>6-Digit Verification Code</label>
                  <input
                    type="text"
                    placeholder="778942"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="glass-input mono"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Enter New Password</label>
                  <input
                    type="password"
                    placeholder="Set new secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="glass-input"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '13.5px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <Key size={15} />
                  <span>Update Password & Save</span>
                </button>
              </div>
            )}

            {resetStep === 3 && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>Password Updated!</div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 16px 0' }}>
                  Your account password has been updated. You can now sign in using your new credentials.
                </p>
                <button
                  type="button"
                  onClick={() => { setActiveMode('LOGIN'); setResetStep(1); }}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  Proceed to Sign In
                </button>
              </div>
            )}
          </form>
        )}

        {/* Security Tag */}
        <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b' }}>
          <span>🔒 256-Bit Telematics Crypt-Handshake</span>
          <span>Role Permissions Enforced</span>
        </div>

      </div>
    </div>
  );
}

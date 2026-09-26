import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Activity, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Mic, 
  Clock, 
  Wifi,
  Sparkles,
  Layers,
  User,
  Shield,
  Siren,
  ChevronDown,
  Lock,
  ArrowRightLeft
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function Header({ 
  system, 
  currentUser, 
  onReset, 
  onOpenVoiceModal, 
  onOpenAuthModal, 
  onOpenSosModal, 
  onSwitchRole 
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const logoRef = useRef(null);
  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const sosBtnRef = useRef(null);

  // GSAP Smooth Header Entrance & Ambient Ring Pulse
  useEffect(() => {
    // Header Fade Down
    gsap.fromTo(headerRef.current, 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Continuous Subtle Daffodils Logo Breathing Pulse
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        boxShadow: '0 0 24px rgba(245, 158, 11, 0.45)',
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: 'sine.inOut'
      });
    }

    // Status Badge Pulse
    if (badgeRef.current) {
      gsap.fromTo(badgeRef.current,
        { scale: 0.98 },
        { scale: 1.02, repeat: -1, yoyo: true, duration: 2.2, ease: 'power1.inOut' }
      );
    }
  }, []);

  // Pulse effect on SOS button if commuter is active
  useEffect(() => {
    if (sosBtnRef.current && currentUser?.role === 'COMMUTATOR') {
      gsap.to(sosBtnRef.current, {
        boxShadow: '0 0 22px rgba(239, 68, 68, 0.8)',
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: 'sine.inOut'
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playRadarPing();
  };

  const isControlRoom = currentUser?.role === 'CONTROL_ROOM';

  return (
    <header 
      ref={headerRef} 
      className="glass-panel" 
      style={{ 
        margin: '14px 18px 8px 18px', 
        padding: '12px 20px', 
        borderRadius: '14px', 
        border: '1px solid rgba(255,255,255,0.1)' 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Brand Identity: DAFFODILS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div 
            ref={logoRef}
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '11px', 
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)', 
              border: '1px solid rgba(245, 158, 11, 0.45)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)',
              cursor: 'pointer'
            }}
            onClick={() => soundFx.playRadarPing()}
          >
            <Radio size={24} color="#fbbf24" className="animate-pulse" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                fontSize: '23px', 
                fontWeight: '800', 
                letterSpacing: '-0.02em', 
                background: 'linear-gradient(to right, #ffffff 20%, #fde68a 60%, #67e8f9 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                DAFFODILS
              </span>
              <span className="badge-status badge-amber" style={{ fontSize: '10.5px' }}>
                INTELLIGENCE PLATFORM
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                Daffodils Engine v2.0
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span>Real-Time Mobility, Logistics & Continuity Intelligence Platform</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>“From Where Things Are → To What Happens Next”</span>
            </div>
          </div>
        </div>

        {/* Academic FYP Milestone Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            ref={badgeRef}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '9px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '9px'
            }}
          >
            <span className="pulsing-green-dot"></span>
            <div>
              <div style={{ fontSize: '10px', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: '700' }}>
                SYSTEM EVALUATION STATUS
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
                {system?.phase || 'PHASE 1 & 2 ACTIVE [68.4% MILESTONE COMPLETED]'}
              </div>
            </div>
          </div>
        </div>

        {/* User Persona & Role Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Commuter Emergency SOS Button (Active when in commuter mode) */}
          {!isControlRoom && (
            <button
              ref={sosBtnRef}
              onClick={onOpenSosModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 15px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#ffffff',
                border: '1px solid #f87171',
                fontWeight: '800',
                fontSize: '12px',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(239, 68, 68, 0.5)'
              }}
            >
              <Siren size={16} className="animate-spin" />
              <span>EMERGENCY SOS</span>
            </button>
          )}

          {/* User Account Capsule */}
          <div 
            onClick={onOpenAuthModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '5px 12px 5px 8px',
              borderRadius: '10px',
              background: isControlRoom ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: isControlRoom ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Click to Switch Accounts or Open Login Dialog"
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: isControlRoom ? '#f59e0b' : '#10b981',
              color: '#050811',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '13px'
            }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>
                {currentUser?.name || 'Authorized User'}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: isControlRoom ? '#fde68a' : '#a7f3d0', 
                fontWeight: '600',
                letterSpacing: '0.03em'
              }}>
                {isControlRoom ? '🛡️ CONTROL ROOM COMMANDER' : '🚗 COMMUTATOR CLIENT'}
              </div>
            </div>

            <ChevronDown size={14} color="#94a3b8" />
          </div>

          {/* 1-Click Fast Persona Switch Pill (Ideal for College Presentation) */}
          <button
            onClick={() => onSwitchRole(isControlRoom ? 'COMMUTATOR' : 'CONTROL_ROOM')}
            className="btn-ghost"
            style={{
              padding: '6px 11px',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              fontSize: '11px',
              gap: '5px'
            }}
            title={isControlRoom ? 'Switch to Commutator Civilian View' : 'Switch to Master Control Room Operations'}
          >
            <ArrowRightLeft size={13} color="#06b6d4" />
            <span style={{ color: '#cbd5e1' }}>
              {isControlRoom ? 'Switch to Commutator' : 'Switch to Control Room'}
            </span>
          </button>

          {/* Telemetry Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#cbd5e1', background: 'rgba(15,23,42,0.6)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Clock size={13} color="#fbbf24" />
            <span className="mono">{currentTime}</span>
          </div>

          {/* Voice Dispatch AI Trigger */}
          <button 
            onClick={onOpenVoiceModal} 
            className="btn-ghost" 
            title="Open Conversational Voice Dispatcher"
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.1)' }}
          >
            <Mic size={14} color="#fbbf24" />
            <span style={{ color: '#fbbf24', fontSize: '11.5px' }}>Voice AI</span>
          </button>

          {/* Sound Mute Toggle */}
          <button 
            onClick={handleToggleSound} 
            className="btn-ghost" 
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={14} color="#ef4444" /> : <Volume2 size={14} color="#10b981" />}
          </button>

          {/* Reset Demo Data Button */}
          <button 
            onClick={onReset} 
            className="btn-ghost" 
            title="Reset Data to Factory Demo State"
            style={{ color: '#94a3b8' }}
          >
            <RotateCcw size={13} />
            <span style={{ fontSize: '11.5px' }}>Reset</span>
          </button>

        </div>

      </div>
    </header>
  );
}

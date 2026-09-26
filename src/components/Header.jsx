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
  ArrowRightLeft,
  Bell,
  Presentation,
  Leaf,
  BookOpen,
  Languages
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';
import { i18n } from '../services/i18nService';

export default function Header({ 
  system, 
  currentUser, 
  onReset, 
  onOpenVoiceModal, 
  onOpenAuthModal, 
  onOpenSosModal, 
  onSwitchRole,
  onOpenStoryboard,
  onOpenAnalytics,
  onOpenArchitecture,
  onToggleNotifications,
  unreadNotificationsCount = 0
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentLang, setCurrentLang] = useState(i18n.getLanguage());

  const logoRef = useRef(null);
  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const sosBtnRef = useRef(null);
  const storyboardBtnRef = useRef(null);

  // GSAP Smooth Header Entrance & Ambient Ring Pulse
  useEffect(() => {
    gsap.fromTo(headerRef.current, 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    if (logoRef.current) {
      gsap.to(logoRef.current, {
        boxShadow: '0 0 24px rgba(245, 158, 11, 0.45)',
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: 'sine.inOut'
      });
    }

    if (badgeRef.current) {
      gsap.fromTo(badgeRef.current,
        { scale: 0.98 },
        { scale: 1.02, repeat: -1, yoyo: true, duration: 2.2, ease: 'power1.inOut' }
      );
    }
  }, []);

  // Listen to language changes
  useEffect(() => {
    const unsubLang = i18n.subscribe((lang) => setCurrentLang(lang));
    return () => unsubLang();
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

  // Subtle breathing shine on Mentor Storyboard button
  useEffect(() => {
    if (storyboardBtnRef.current) {
      gsap.to(storyboardBtnRef.current, {
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.55)',
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'sine.inOut'
      });
    }
  }, []);

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

  const handleLanguageChange = (lang) => {
    i18n.setLanguage(lang);
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
                Daffodils Core v2.0
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span>{i18n.t('brandTagline')}</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>{i18n.t('motto')}</span>
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
                {i18n.t('evaluationStatus')}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
                {system?.phase || i18n.t('milestoneBadge')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
          
          {/* 1-Click Mentor Storyboard Showcase Button */}
          <button
            ref={storyboardBtnRef}
            onClick={onOpenStoryboard}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 13px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.2) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.55)',
              color: '#fde68a',
              fontWeight: '700',
              fontSize: '11.5px',
              cursor: 'pointer'
            }}
            title="Open Interactive Mentor Guided Presentation Storyboard"
          >
            <Presentation size={15} color="#fbbf24" />
            <span>{i18n.t('storyboard')}</span>
          </button>

          {/* ESG Carbon Analytics Modal Trigger */}
          <button
            onClick={onOpenAnalytics}
            className="btn-ghost"
            style={{ padding: '6px 11px', fontSize: '11.5px', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#6ee7b7' }}
            title="View ESG Carbon Offset & Grid Analytics"
          >
            <Leaf size={14} />
            <span>{i18n.t('analytics')}</span>
          </button>

          {/* Architecture Blueprint Modal Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="btn-ghost"
            style={{ padding: '6px 11px', fontSize: '11.5px', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#67e8f9' }}
            title="View Academic Architecture Blueprint & Defense Dossier"
          >
            <BookOpen size={14} />
            <span>{i18n.t('blueprint')}</span>
          </button>

          {/* Regional Multi-Language Selector Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '2px',
            gap: '2px'
          }}>
            <Languages size={13} color="#94a3b8" style={{ marginLeft: '6px', marginRight: '2px' }} />
            {['EN', 'BN', 'HI'].map(lang => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                style={{
                  background: currentLang === lang ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                  border: currentLang === lang ? '1px solid rgba(245, 158, 11, 0.45)' : 'none',
                  borderRadius: '6px',
                  padding: '3px 7px',
                  color: currentLang === lang ? '#fbbf24' : '#94a3b8',
                  fontSize: '10.5px',
                  fontWeight: currentLang === lang ? '800' : '500',
                  cursor: 'pointer'
                }}
                title={lang === 'EN' ? 'English' : lang === 'BN' ? 'বাংলা (Bengali)' : 'हिंदी (Hindi)'}
              >
                {lang === 'EN' ? 'EN' : lang === 'BN' ? 'বাং' : 'हिं'}
              </button>
            ))}
          </div>

          {/* Live Notification Center Bell Button */}
          <button
            onClick={onToggleNotifications}
            className="btn-ghost"
            style={{
              padding: '6px 10px',
              position: 'relative',
              borderColor: unreadNotificationsCount > 0 ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.1)'
            }}
            title="Open Live Notification Stream"
          >
            <Bell size={15} color={unreadNotificationsCount > 0 ? '#06b6d4' : '#94a3b8'} />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#06b6d4',
                color: '#050811',
                borderRadius: '10px',
                padding: '1px 5px',
                fontSize: '9.5px',
                fontWeight: '900',
                boxShadow: '0 0 8px #06b6d4'
              }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Commuter Emergency SOS Button (Active in commuter mode) */}
          {!isControlRoom && (
            <button
              ref={sosBtnRef}
              onClick={onOpenSosModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#ffffff',
                border: '1px solid #f87171',
                fontWeight: '800',
                fontSize: '11.5px',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(239, 68, 68, 0.5)'
              }}
            >
              <Siren size={15} className="animate-spin" />
              <span>{i18n.t('emergencySos')}</span>
            </button>
          )}

          {/* User Account Capsule */}
          <div 
            onClick={onOpenAuthModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 7px',
              borderRadius: '9px',
              background: isControlRoom ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: isControlRoom ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Click to Switch Accounts or Open Login Dialog"
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: isControlRoom ? '#f59e0b' : '#10b981',
              color: '#050811',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '12px'
            }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>

            <div>
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>
                {currentUser?.name || 'Authorized User'}
              </div>
              <div style={{ 
                fontSize: '9.5px', 
                color: isControlRoom ? '#fde68a' : '#a7f3d0', 
                fontWeight: '600'
              }}>
                {isControlRoom ? i18n.t('controlRoomCommander') : i18n.t('commutatorClient')}
              </div>
            </div>

            <ChevronDown size={13} color="#94a3b8" />
          </div>

          {/* 1-Click Fast Persona Switch Pill */}
          <button
            onClick={() => onSwitchRole(isControlRoom ? 'COMMUTATOR' : 'CONTROL_ROOM')}
            className="btn-ghost"
            style={{
              padding: '5px 10px',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              fontSize: '11px',
              gap: '5px'
            }}
            title={isControlRoom ? 'Switch to Commutator Civilian View' : 'Switch to Master Control Room Operations'}
          >
            <ArrowRightLeft size={12} color="#06b6d4" />
            <span style={{ color: '#cbd5e1' }}>
              {isControlRoom ? i18n.t('switchToCommutator') : i18n.t('switchToControlRoom')}
            </span>
          </button>

          {/* Telemetry Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#cbd5e1', background: 'rgba(15,23,42,0.6)', padding: '5px 9px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Clock size={12} color="#fbbf24" />
            <span className="mono">{currentTime}</span>
          </div>

          {/* Voice Dispatch AI Trigger */}
          <button 
            onClick={onOpenVoiceModal} 
            className="btn-ghost" 
            title="Open Conversational Voice Dispatcher"
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.1)', padding: '5px 9px' }}
          >
            <Mic size={13} color="#fbbf24" />
            <span style={{ color: '#fbbf24', fontSize: '11px' }}>{i18n.t('voiceAi')}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button 
            onClick={handleToggleSound} 
            className="btn-ghost" 
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{ padding: '5px 8px' }}
          >
            {isMuted ? <VolumeX size={13} color="#ef4444" /> : <Volume2 size={13} color="#10b981" />}
          </button>

          {/* Reset Demo Data Button */}
          <button 
            onClick={onReset} 
            className="btn-ghost" 
            title="Reset Data to Factory Demo State"
            style={{ color: '#94a3b8', padding: '5px 8px' }}
          >
            <RotateCcw size={12} />
            <span style={{ fontSize: '11px' }}>{i18n.t('reset')}</span>
          </button>

        </div>

      </div>
    </header>
  );
}

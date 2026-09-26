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
  Layers
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function Header({ system, onReset, onOpenVoiceModal }) {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const logoRef = useRef(null);
  const headerRef = useRef(null);
  const badgeRef = useRef(null);

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

        {/* Strategic Academic FYP Milestone Badge */}
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
                {system?.phase || 'PHASE 1 & 2 ACTIVE [68.4% MILESTONE]'}
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Status Metrics & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Live Telemetry Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1', background: 'rgba(15,23,42,0.6)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Clock size={14} color="#fbbf24" />
            <span className="mono">{currentTime}</span>
          </div>

          {/* Latency */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1', background: 'rgba(15,23,42,0.6)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Wifi size={14} color="#10b981" />
            <span className="mono">{system?.avgNetworkLatencyMs || 24}ms</span>
          </div>

          {/* Voice Dispatch AI Quick Trigger */}
          <button 
            onClick={onOpenVoiceModal} 
            className="btn-ghost" 
            title="Open Conversational Voice Dispatcher"
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.1)' }}
          >
            <Mic size={15} color="#fbbf24" />
            <span style={{ color: '#fbbf24' }}>Voice AI</span>
          </button>

          {/* Sound Mute Toggle */}
          <button 
            onClick={handleToggleSound} 
            className="btn-ghost" 
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} color="#ef4444" /> : <Volume2 size={15} color="#10b981" />}
          </button>

          {/* Reset Demo Data Button */}
          <button 
            onClick={onReset} 
            className="btn-ghost" 
            title="Reset Data to Factory Demo State"
            style={{ color: '#94a3b8' }}
          >
            <RotateCcw size={14} />
            <span style={{ fontSize: '12px' }}>Reset State</span>
          </button>

        </div>

      </div>
    </header>
  );
}

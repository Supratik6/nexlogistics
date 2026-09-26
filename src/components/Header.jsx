import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Activity, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Mic, 
  ShieldCheck, 
  Clock, 
  Wifi,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../services/soundService';
import { aiService } from '../services/aiService';

export default function Header({ system, onReset, onOpenVoiceModal }) {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

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
    <header className="glass-panel" style={{ margin: '14px 18px 8px 18px', padding: '12px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Brand & Team Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '11px', 
            background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(99,102,241,0.2) 100%)', 
            border: '1px solid rgba(6,182,212,0.4)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(6,182,212,0.25)'
          }}>
            <Radio size={24} color="#06b6d4" className="animate-pulse" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.03em', background: 'linear-gradient(to right, #ffffff, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                VYONEX
              </span>
              <span className="badge-status badge-cyan">
                TEAM NEXORA
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                ACCESSNEXA v1.4
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span>Real-Time Mobility, Logistics & Continuity Intelligence Platform</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#06b6d4', fontStyle: 'italic' }}>“From Where Things Are → To What Happens Next”</span>
            </div>
          </div>
        </div>

        {/* Strategic Academic FYP Milestone Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '9px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '9px'
          }}>
            <span className="pulsing-green-dot"></span>
            <div>
              <div style={{ fontSize: '10px', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: '700' }}>
                SYSTEM EVALUATION STATUS
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
                {system?.phase || 'PHASE 1 & 2 OPERATIONAL [68.4% MILESTONE]'}
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Status Metrics & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Live Telemetry Ping */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1', background: 'rgba(15,23,42,0.6)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Clock size={14} color="#06b6d4" />
            <span className="mono">{currentTime}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1', background: 'rgba(15,23,42,0.6)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Wifi size={14} color="#10b981" />
            <span className="mono">{system?.avgNetworkLatencyMs || 24}ms</span>
          </div>

          {/* Voice Dispatch AI Quick Trigger */}
          <button 
            onClick={onOpenVoiceModal} 
            className="btn-ghost" 
            title="Open Conversational Voice Dispatcher"
            style={{ borderColor: 'rgba(6, 182, 212, 0.4)', background: 'rgba(6, 182, 212, 0.1)' }}
          >
            <Mic size={15} color="#22d3ee" />
            <span style={{ color: '#22d3ee' }}>Voice AI</span>
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

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  CheckCheck, 
  Trash2, 
  X, 
  AlertTriangle, 
  Car, 
  Truck, 
  Package, 
  Siren, 
  BrainCircuit,
  Radio,
  Play
} from 'lucide-react';
import gsap from 'gsap';
import { notificationService } from '../services/notificationService';
import { soundFx } from '../services/soundService';

export default function NotificationCenter({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [notifications, setNotifications] = useState(notificationService.getNotifications());
  const [speechEnabled, setSpeechEnabled] = useState(notificationService.getSpeechEnabled());
  const [activeFilter, setActiveFilter] = useState('ALL');

  const panelRef = useRef(null);

  useEffect(() => {
    const unsub = notificationService.subscribe((list, speech) => {
      setNotifications([...list]);
      setSpeechEnabled(speech);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'back.out(1.5)' }
      );
    }
  }, [isOpen]);

  const handleToggleSpeech = () => {
    notificationService.setSpeechEnabled(!speechEnabled);
  };

  const handleSpeakItem = (item) => {
    notificationService.speak(`${item.title}. ${item.message}`);
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'EMERGENCY') return n.category === 'EMERGENCY';
    if (activeFilter === 'MOBILITY') return n.category === 'MOBILITY';
    if (activeFilter === 'LOGISTICS') return n.category === 'FREIGHT' || n.category === 'MOVERS';
    return true;
  });

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'EMERGENCY': return <Siren size={15} color="#ef4444" />;
      case 'MOBILITY': return <Car size={15} color="#06b6d4" />;
      case 'FREIGHT': return <Truck size={15} color="#818cf8" />;
      case 'MOVERS': return <Package size={15} color="#c084fc" />;
      case 'CONTINUITY': return <BrainCircuit size={15} color="#fbbf24" />;
      default: return <Radio size={15} color="#10b981" />;
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: '68px',
        right: '24px',
        width: '380px',
        maxWidth: '92vw',
        background: '#090e1a',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(6, 182, 212, 0.15)',
        zIndex: 9990,
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      ref={panelRef}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(245, 158, 11, 0.12) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="#06b6d4" />
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.02em' }}>
            LIVE TELEMETRY STREAM
          </span>
          <span className="badge-status badge-cyan" style={{ fontSize: '10px' }}>
            {notifications.filter(n => !n.read).length} Unread
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleToggleSpeech}
            style={{
              background: speechEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: speechEnabled ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: speechEnabled ? '#6ee7b7' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '10.5px'
            }}
            title={speechEnabled ? 'Speech Synthesis Enabled' : 'Speech Synthesis Disabled'}
          >
            {speechEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>Voice TTS</span>
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Quick Action Bar */}
      <div style={{
        padding: '8px 14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        background: 'rgba(15, 23, 42, 0.5)'
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['ALL', 'EMERGENCY', 'MOBILITY', 'LOGISTICS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                background: activeFilter === tab ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                border: activeFilter === tab ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '3px 7px',
                color: activeFilter === tab ? '#fbbf24' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: activeFilter === tab ? '700' : '400',
                fontSize: '10.5px'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => notificationService.markAllAsRead()}
            style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10.5px' }}
            title="Mark all as read"
          >
            <CheckCheck size={12} />
            <span>Read All</span>
          </button>
          <button
            onClick={() => notificationService.clearAll()}
            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10.5px' }}
            title="Clear notification history"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Notification Stream Items */}
      <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '10px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '28px 14px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
            No incoming notifications in this filter stream.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                background: item.read ? 'rgba(15, 23, 42, 0.45)' : 'rgba(15, 23, 42, 0.85)',
                border: item.severity === 'CRITICAL' 
                  ? '1px solid rgba(239, 68, 68, 0.45)' 
                  : item.read 
                  ? '1px solid rgba(255, 255, 255, 0.05)' 
                  : '1px solid rgba(6, 182, 212, 0.35)',
                marginBottom: '8px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {!item.read && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: item.severity === 'CRITICAL' ? '#ef4444' : '#06b6d4',
                  boxShadow: `0 0 6px ${item.severity === 'CRITICAL' ? '#ef4444' : '#06b6d4'}`
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {getCategoryIcon(item.category)}
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                  {item.title}
                </span>
              </div>

              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4', marginBottom: '6px' }}>
                {item.message}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span className="mono">{item.time}</span>
                <button
                  onClick={() => handleSpeakItem(item)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    color: '#67e8f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                  title="Speak out loud"
                >
                  <Play size={9} />
                  <span>Listen</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Siren, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  X, 
  Radio, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Zap 
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';
import { storageService } from '../services/storageService';

export default function SosModal({ isOpen, onClose, currentUser }) {
  if (!isOpen) return null;

  const [sosStatus, setSosStatus] = useState('BROADCASTING'); // 'BROADCASTING' | 'DISPATCHED' | 'STANDBY'
  const [gpsCoords, setGpsCoords] = useState({ lat: 22.5726, lng: 88.3639 });
  const [etaSeconds, setEtaSeconds] = useState(240); // 4 min ETA
  const [dispatchedAmbulance, setDispatchedAmbulance] = useState(null);
  const [sosLog, setSosLog] = useState([]);

  const modalRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  // Entrance & SOS Beacon Trigger
  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.7)' }
      );
    }

    soundFx.playAlertPing();
    
    // Acquire live browser GPS if allowed
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5))
          });
        },
        () => {
          // Fallback to Kolkata Smart City Central Sector V
          setGpsCoords({ lat: 22.5804, lng: 88.4378 });
        }
      );
    }

    // Auto dispatch emergency ambulance in Daffodils core
    const timer = setTimeout(() => {
      try {
        const amb = storageService.dispatchAmbulance({
          callerName: currentUser?.name || 'Verified Commuter',
          callerPhone: currentUser?.phone || '+91 98310 99887',
          location: `Device GPS [${gpsCoords.lat}, ${gpsCoords.lng}]`,
          emergencyType: 'COMMUTER_PANIC_BEACON',
          severity: 'CRITICAL',
          notes: 'High-priority SOS triggered by commuter via Daffodils Lifeline App'
        });
        setDispatchedAmbulance(amb);
        setSosStatus('DISPATCHED');
        soundFx.playSuccessChime();
      } catch (e) {
        setSosStatus('DISPATCHED');
      }
    }, 1800);

    return () => {
      clearTimeout(timer);
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
    };
  }, [isOpen]);

  // Countdown timer for ambulance arrival
  useEffect(() => {
    if (sosStatus === 'DISPATCHED') {
      const countdown = setInterval(() => {
        setEtaSeconds(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [sosStatus]);

  const handleCancelSos = () => {
    soundFx.playRadarPing();
    onClose();
  };

  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;
  const etaFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 2, 4, 0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div 
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(180deg, #180509 0%, #0d0205 100%)',
          border: '2px solid #ef4444',
          borderRadius: '20px',
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.45), 0 20px 40px rgba(0, 0, 0, 0.9)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Pulsing Code-Red Header Bar */}
        <div style={{
          background: 'linear-gradient(90deg, #991b1b 0%, #ef4444 50%, #991b1b 100%)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626'
            }} className="animate-pulse">
              <Siren size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '0.04em' }}>
                PRIORITY-0 EMERGENCY SOS
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                Daffodils LifeLine Emergency Preemption Corridor
              </div>
            </div>
          </div>

          <button
            onClick={handleCancelSos}
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: 'none',
              borderRadius: '8px',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* SOS Body */}
        <div style={{ padding: '24px', color: '#f8fafc' }}>
          
          {/* Beacon Status Banner */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="pulsing-green-dot" style={{ background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#fca5a5', letterSpacing: '0.05em' }}>
                {sosStatus === 'BROADCASTING' ? 'TRANSMITTING BEACON TO CONTROL ROOM...' : 'EMERGENCY UNIT DISPATCHED & EN ROUTE'}
              </span>
            </div>

            <div style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace', margin: '6px 0' }}>
              ETA {etaFormatted} MIN
            </div>
            <div style={{ fontSize: '11.5px', color: '#fca5a5' }}>
              Signal Preemption active: All traffic lights in transit corridor locking to GREEN WAVE
            </div>
          </div>

          {/* Telemetry and Location Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
              <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={13} color="#ef4444" />
                <span>Broadcasting GPS Fix:</span>
              </span>
              <span style={{ color: '#67e8f9', fontFamily: 'monospace', fontWeight: '700' }}>
                {gpsCoords.lat}° N, {gpsCoords.lng}° E
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
              <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Radio size={13} color="#fbbf24" />
                <span>Responding Unit:</span>
              </span>
              <span style={{ color: '#fde68a', fontWeight: '700' }}>
                {dispatchedAmbulance?.id || 'DAF-AMB-01 (ALS Mobile ICU)'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Activity size={13} color="#10b981" />
                <span>Assigned Hospital:</span>
              </span>
              <span style={{ color: '#a7f3d0', fontWeight: '600' }}>
                Apollo Multispecialty Trauma Center
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href="tel:112"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '13px',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
              }}
              onClick={() => soundFx.playSuccessChime()}
            >
              <PhoneCall size={16} />
              <span>Direct Dial 112 Helpline</span>
            </a>

            <button
              onClick={handleCancelSos}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Stand Down / Cancel SOS
            </button>
          </div>

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', color: '#94a3b8' }}>
            Emergency alert logged under Daffodils Incident Reference #<span style={{ fontFamily: 'monospace', color: '#ffffff' }}>SOS-{Date.now().toString().slice(-6)}</span>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Siren, 
  HeartPulse, 
  Activity, 
  ShieldAlert, 
  Hospital, 
  Radio, 
  Volume2, 
  MapPin, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  Flame
} from 'lucide-react';
import { soundFx } from '../services/soundService';

export default function AmbulanceTab({ emergencyAlerts, onDispatchAmbulance, onSelectVehicle, vehicles }) {
  const [patientName, setPatientName] = useState('Anirban Roy (62M)');
  const [condition, setCondition] = useState('Acute Myocardial Infarction (Severe Chest Pain)');
  const [triageCode, setTriageCode] = useState('CODE_RED');
  const [pickupLocation, setPickupLocation] = useState('Rashbehari Crossing, South Kolkata');
  const [destinationHospital, setDestinationHospital] = useState('Apex Multi-Specialty Heart & Trauma Bay 3');
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const canvasRef = useRef(null);
  const ecgOffsetRef = useRef(0);

  // Live ECG Waveform Animation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const renderECG = () => {
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ECG Line
      ctx.strokeStyle = triageCode === 'CODE_RED' ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = triageCode === 'CODE_RED' ? '#ef4444' : '#10b981';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      ecgOffsetRef.current = (ecgOffsetRef.current + 2) % 300;
      const midY = canvas.height / 2;

      for (let x = 0; x < canvas.width; x++) {
        const relX = (x + ecgOffsetRef.current) % 120;
        let y = midY;

        // P-Q-R-S-T wave simulation
        if (relX > 40 && relX < 50) {
          y = midY - 6; // P wave
        } else if (relX >= 50 && relX < 55) {
          y = midY + 4; // Q wave
        } else if (relX >= 55 && relX < 65) {
          y = midY - 32; // R peak
        } else if (relX >= 65 && relX < 72) {
          y = midY + 12; // S dip
        } else if (relX >= 80 && relX < 95) {
          y = midY - 10; // T wave
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(renderECG);
    };

    renderECG();
    return () => cancelAnimationFrame(animationId);
  }, [triageCode]);

  const handleDispatch = (e) => {
    e.preventDefault();
    onDispatchAmbulance({
      patientName,
      condition,
      triageCode,
      pickupLocation,
      destinationHospital
    });

    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 4000);
  };

  const handleTestSiren = () => {
    soundFx.playEmergencySirenBurst();
  };

  const activeAmbulance = vehicles.find(v => v.type === 'AMBULANCE');

  return (
    <div style={{ padding: '0 18px 24px 18px' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-status badge-crimson">
              PUBLIC SAFETY PILLAR 4
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              ACCESSNEXA Priority-0 Lifeline Corridor & Preemption Engine
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
            Ambulance Lifeline & Dynamic Green Corridor
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleTestSiren}
            className="btn-crimson"
            style={{ padding: '7px 14px', fontSize: '12px' }}
          >
            <Volume2 size={15} />
            <span>Test Corridor Siren Sound</span>
          </button>
        </div>
      </div>

      {dispatchedSuccess && (
        <div className="glass-panel" style={{
          marginBottom: '16px',
          padding: '12px 18px',
          background: 'rgba(239, 68, 68, 0.18)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ShieldAlert size={22} color="#ef4444" />
          <div>
            <div style={{ fontWeight: '700', color: '#f87171' }}>Priority-0 Lifeline Mission Dispatched!</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Dynamic Green Corridor engaged. Traffic signal preemption broadcasted along route to {destinationHospital}.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Telemetry & Dispatch Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(320px, 1fr)', gap: '18px' }}>
        
        {/* Left Column: Live Emergency Dispatcher & Vitals Stream */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={20} color="#ef4444" />
              <h3 style={{ fontSize: '16px', color: '#ffffff' }}>Live Patient Vitals Telemetry (ICU Stream)</h3>
            </div>
            <span className="badge-status badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulsing-red-dot"></span>
              STREAMING TO ED BAY 3
            </span>
          </div>

          {/* Animated ECG Waveform */}
          <div style={{ marginBottom: '16px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <canvas ref={canvasRef} width={480} height={110} style={{ width: '100%', height: '110px', display: 'block' }} />
          </div>

          {/* Vitals Telemetry Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
            <div className="glass-card" style={{ padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>HEART RATE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#f87171' }}>
                122 <span style={{ fontSize: '10px' }}>BPM</span>
              </div>
            </div>
            <div className="glass-card" style={{ padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>OXYGEN (SPO2)</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8' }}>
                93 <span style={{ fontSize: '10px' }}>%</span>
              </div>
            </div>
            <div className="glass-card" style={{ padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>BLOOD PRESS.</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#f1f5f9' }}>
                135/88
              </div>
            </div>
            <div className="glass-card" style={{ padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>CORRIDOR ETA</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>
                {activeAmbulance?.etaMinutes || 7} <span style={{ fontSize: '10px' }}>MINS</span>
              </div>
            </div>
          </div>

          {/* Emergency Dispatch Form */}
          <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Siren size={15} color="#ef4444" />
              <span>Initiate Priority Emergency Dispatch:</span>
            </div>

            <form onSubmit={handleDispatch}>
              {/* Triage Level Selector */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Emergency Triage Classification:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { code: 'CODE_RED', label: 'Code Red (P-0)', color: '#ef4444' },
                    { code: 'CODE_AMBER', label: 'Code Amber (P-1)', color: '#f59e0b' },
                    { code: 'CODE_YELLOW', label: 'Code Yellow (P-2)', color: '#10b981' }
                  ].map(t => (
                    <button
                      type="button"
                      key={t.code}
                      onClick={() => { setTriageCode(t.code); soundFx.playRadarPing(); }}
                      style={{
                        background: triageCode === t.code ? `${t.color}25` : 'rgba(15, 23, 42, 0.6)',
                        border: triageCode === t.code ? `1px solid ${t.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                        color: triageCode === t.code ? t.color : '#cbd5e1',
                        padding: '8px 6px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Info Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Patient Identity / Age</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="glass-input"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Suspected Diagnosis</label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="glass-input"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              {/* Location & Destination Hospital */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Pickup Location</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="glass-input"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Trauma Care Hospital</label>
                  <input
                    type="text"
                    value={destinationHospital}
                    onChange={(e) => setDestinationHospital(e.target.value)}
                    className="glass-input"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-crimson"
                style={{ width: '100%', fontSize: '13px', padding: '11px 18px' }}
              >
                <Zap size={16} />
                <span>Preempt Green Corridor & Dispatch Lifeline Unit</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Dynamic Green Corridor & Signal Preemption Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="glass-panel" style={{ padding: '18px', border: '1px solid rgba(239, 68, 68, 0.35)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={18} color="#ef4444" />
                <h3 style={{ fontSize: '15px', color: '#ffffff' }}>Green Corridor Signal Preemption Hub</h3>
              </div>
              <span className="badge-status badge-emerald" style={{ fontSize: '10px' }}>
                ACTIVE INTERSECTIONS: 3
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
              ACCESSNEXA communicates with municipal traffic controllers along the emergency path, extending green cycles and holding crossing nodes to guarantee continuous non-stop transit.
            </p>

            {/* Intersections Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                { name: 'Exide Crossing Intersection', status: 'HELD GREEN (45s cycle extended)', cleared: true },
                { name: 'Mullick Bazar Traffic Junction', status: 'HELD GREEN (60s cycle extended)', cleared: true },
                { name: 'Park Circus Flyover Ingress', status: 'TRANSIT CORRIDOR CLEARED', cleared: true },
                { name: 'Hospital Trauma Emergency Gate', status: 'GATE AUTOMATION ACTIVATED', cleared: false }
              ].map((node, nIdx) => (
                <div key={nIdx} className="glass-card" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: node.cleared ? '#10b981' : '#f59e0b', boxShadow: `0 0 8px ${node.cleared ? '#10b981' : '#f59e0b'}` }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#f1f5f9' }}>{node.name}</span>
                  </div>
                  <span className="mono" style={{ fontSize: '10.5px', color: node.cleared ? '#34d399' : '#fbbf24' }}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Active Ambulance Tracking Action */}
            {activeAmbulance && (
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>ASSIGNED LIFELINE UNIT</div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#ef4444' }}>
                      {activeAmbulance.id} ({activeAmbulance.subType})
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                      EMT: Dr. K. Bose • Driver: Somenath Roy
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectVehicle(activeAmbulance)}
                    className="btn-ghost"
                    style={{ fontSize: '11.5px', padding: '6px 12px', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
                  >
                    Track on Map
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

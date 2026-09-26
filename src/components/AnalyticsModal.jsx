import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Leaf, 
  Zap, 
  Clock, 
  ShieldCheck, 
  X, 
  TrendingUp, 
  Activity, 
  Fuel, 
  Award,
  Globe,
  Sliders
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function AnalyticsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [fleetSize, setFleetSize] = useState(15);
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  }, [isOpen]);

  // Dynamic calculations based on simulated fleet scale
  const dailyKm = fleetSize * 140;
  const co2SavedKg = Math.round(dailyKm * 0.184); // 184g CO2 saved per km in EV vs ICE
  const fuelSavedLitres = Math.round(dailyKm / 12);
  const treeEquivalent = Math.round(co2SavedKg / 21); // ~21kg absorbed per tree/year
  const annualCo2Tons = ((co2SavedKg * 365) / 1000).toFixed(1);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 7, 18, 0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div 
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '820px',
          background: '#090e1a',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '18px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(16, 185, 129, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden',
          color: '#e2e8f0'
        }}
      >
        {/* Top Header */}
        <div style={{
          padding: '14px 22px',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Leaf size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.02em' }}>
                ESG CARBON INTELLIGENCE & FLEET TELEMATICS
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Sustainability Metrics, Grid Velocity & Autonomous Continuity SLA
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '22px 26px',
          overflowY: 'auto',
          fontSize: '12.5px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          
          {/* Top KPI Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6ee7b7', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                <Leaf size={14} />
                <span>CO₂ Avoided Today</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace', margin: '6px 0' }}>
                {co2SavedKg} kg
              </div>
              <div style={{ fontSize: '10.5px', color: '#a7f3d0' }}>
                Equivalent to planting ~{treeEquivalent} mature trees
              </div>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.35)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#67e8f9', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                <TrendingUp size={14} />
                <span>Corridor Velocity</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace', margin: '6px 0' }}>
                38.6 km/h
              </div>
              <div style={{ fontSize: '10.5px', color: '#67e8f9' }}>
                +84% velocity over 21 km/h urban baseline
              </div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fca5a5', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                <Zap size={14} />
                <span>Green Wave Preemption</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace', margin: '6px 0' }}>
                99.4%
              </div>
              <div style={{ fontSize: '10.5px', color: '#fca5a5' }}>
                Lifeline signal priority lock success rate
              </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fde68a', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                <Fuel size={14} />
                <span>Diesel Conserved</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace', margin: '6px 0' }}>
                {fuelSavedLitres} L
              </div>
              <div style={{ fontSize: '10.5px', color: '#fde68a' }}>
                Urban particulate reduction verified
              </div>
            </div>

          </div>

          {/* Interactive Fleet Scale Simulator Slider */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={15} color="#fbbf24" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                  Simulated Municipal Fleet Scaling (Predictive Modeling):
                </span>
              </div>
              <span className="mono" style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24' }}>
                {fleetSize} Active EV Units
              </span>
            </div>

            <input 
              type="range"
              min="5"
              max="100"
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
              <span>5 Pilot Units</span>
              <span>Projected Annual Offset: <strong style={{ color: '#10b981' }}>{annualCo2Tons} Metric Tons CO₂</strong></span>
              <span>100 Full City Grid</span>
            </div>
          </div>

          {/* SLA Performance Bars */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#cbd5e1', marginBottom: '12px' }}>
              Operational Reliability & SLA Telemetry Breakdown:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#cbd5e1' }}>Cold-Chain Pharmaceutical Temperature Adherence (2°C - 8°C)</span>
                  <span className="mono" style={{ color: '#10b981', fontWeight: '700' }}>99.8% Nominal</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '99.8%', height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#cbd5e1' }}>Autonomous Reroute Heuristic Convergence (&lt; 250ms latency)</span>
                  <span className="mono" style={{ color: '#06b6d4', fontWeight: '700' }}>100% Sub-second</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #06b6d4, #818cf8)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#cbd5e1' }}>Packers & Movers Chain-of-Custody Integrity Check</span>
                  <span className="mono" style={{ color: '#c084fc', fontWeight: '700' }}>100% Zero-Loss</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #c084fc, #f472b6)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Footer Note */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
            <span>Environmental Telemetry Certified under Daffodils CleanCity Framework</span>
            <span style={{ color: '#6ee7b7', fontWeight: '600' }}>Phase 1 & 2 Operational [68.4% Milestone Completed]</span>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  Compass, 
  GitFork, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function DisruptionSimulator({ disruptions, onToggleDisruption, onExecuteReroute, vehicles }) {
  const [selectedDisruption, setSelectedDisruption] = useState(disruptions[0] || null);
  const [reroutingVehicleId, setReroutingVehicleId] = useState(null);

  const containerRef = useRef(null);
  const impactCardRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (impactCardRef.current) {
      gsap.fromTo(impactCardRef.current,
        { scale: 0.97, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }
  }, [selectedDisruption]);

  const scenarios = [
    {
      id: 'DIS-001',
      title: 'Maa Flyover Western Inundation (Flash Flood)',
      type: 'WEATHER_FLOOD',
      severity: 'HIGH_ALERT',
      lat: 22.5450,
      lng: 88.3750,
      radiusMeters: 800,
      summary: 'Heavy localized cloudburst causing 45cm water depth on expressway ramp. Traffic speed reduced from 60 km/h to 8 km/h.',
      affectedMissions: ['MIS-MOB-401 (EV Sedan)', 'MIS-FRT-904 (Pharma Cold-Chain)'],
      cascadingImpact: '+28 minutes delay to downstream cold storage delivery. Spoilage risk increased by +32%.',
      contingencyPlan: 'Reroute via AJC Bose Road Lower Bypass. Saves 22 minutes vs waiting in gridlock.'
    },
    {
      id: 'DIS-002',
      title: 'Highway Junction 12 Tanker Collision',
      type: 'ACCIDENT_GRIDLOCK',
      severity: 'CRITICAL',
      lat: 22.5800,
      lng: 88.4100,
      radiusMeters: 1200,
      summary: 'Commercial fuel tanker breakdown blocking 3 lanes on outer connector. Complete gridlock formed.',
      affectedMissions: ['DAF-AMB-911 (Ambulance)', 'DAF-MOV-303 (Packers Van)'],
      cascadingImpact: 'Emergency lifeline ETA projected to blow out from 7 mins to 34 mins without preemption.',
      contingencyPlan: 'Preempt Sector V Service Arterial. Force green cycles at Crossing 4B.'
    }
  ];

  const handleSelectScenario = (sc) => {
    setSelectedDisruption(sc);
    soundFx.playRadarPing();
  };

  const handleRerouteClick = (vehId) => {
    setReroutingVehicleId(vehId);
    onExecuteReroute(vehId);
    setTimeout(() => {
      setReroutingVehicleId(null);
    }, 1500);
  };

  return (
    <div style={{ padding: '0 18px 24px 18px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-status badge-amber">
              COGNITIVE CONTINUITY ENGINE
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Daffodils Impact-Before-Incident Simulation Sandbox
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
            Predictive Disruption & Continuity Intelligence
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="glass-card" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit size={16} color="#f59e0b" />
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Core Paradigm: <strong style={{ color: '#fbbf24' }}>Impact-Before-Incident</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Disruption Scenario Injector & Predictive Impact Matrix */}
      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.1fr) minmax(340px, 1.1fr)', gap: '18px' }}>
        
        {/* Left: Disruption Injector & What-If Sandbox */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            <span>Interactive Disruption Scenarios (Inject or Resolve)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
            {scenarios.map(sc => {
              const isSelected = selectedDisruption?.id === sc.id;
              const liveDisruption = disruptions.find(d => d.id === sc.id);
              const isActive = liveDisruption ? liveDisruption.active : true;

              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className="glass-card"
                  style={{
                    padding: '14px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.6)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono" style={{ fontSize: '12.5px', fontWeight: '800', color: '#fbbf24' }}>
                          {sc.id}
                        </span>
                        <span className={`badge-status ${isActive ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '9.5px' }}>
                          {isActive ? 'HAZARD ACTIVE' : 'RESOLVED'}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
                        {sc.title}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleDisruption(sc.id);
                      }}
                      className="btn-ghost"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      {isActive ? 'Resolve Hazard' : 'Inject Hazard'}
                    </button>
                  </div>

                  <p style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '8px' }}>
                    {sc.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Academic Capability Note */}
          <div className="glass-card" style={{ padding: '12px 14px', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '700' }}>
              DAFFODILS COGNITIVE PRINCIPLE:
            </div>
            <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '2px' }}>
              "Unlike conventional GPS apps that wait until vehicles are already stuck in traffic, Daffodils projects disruption vectors 30 minutes into the future and generates alternative continuity paths."
            </div>
          </div>

        </div>

        {/* Right: Predictive Impact Analysis & Autonomous Failover */}
        <div ref={impactCardRef} className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <h3 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitFork size={18} color="#fbbf24" />
            <span>Impact-Before-Incident Cascading Graph</span>
          </h3>

          {selectedDisruption ? (
            <div>
              
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '10px', marginBottom: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700', textTransform: 'uppercase' }}>
                  CASCADING IMPACT PREDICTION:
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#f8fafc', marginTop: '4px' }}>
                  {selectedDisruption.cascadingImpact}
                </div>
              </div>

              {/* Affected Missions List */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Threatened Operational Missions:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedDisruption.affectedMissions.map((mis, mIdx) => (
                    <div key={mIdx} className="glass-card" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: '600' }}>{mis}</span>
                      <span className="badge-status badge-amber" style={{ fontSize: '10px' }}>
                        AT RISK
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contingency Plan & Autonomous Reroute Button */}
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#34d399', fontWeight: '700', textTransform: 'uppercase' }}>
                  AUTONOMOUS CONTINUITY CONTINGENCY:
                </div>
                <div style={{ fontSize: '12.5px', color: '#f1f5f9', marginTop: '4px' }}>
                  {selectedDisruption.contingencyPlan}
                </div>
              </div>

              {/* Action Buttons for active vehicles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => handleRerouteClick('DAF-FRT-502')}
                  disabled={reroutingVehicleId === 'DAF-FRT-502'}
                  className="btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <RefreshCw size={15} className={reroutingVehicleId === 'DAF-FRT-502' ? 'animate-spin' : ''} />
                  <span>
                    {reroutingVehicleId === 'DAF-FRT-502'
                      ? 'Recomputing & Dispatching Bypass Waypoints...'
                      : 'Execute Autonomous Reroute for DAF-FRT-502 (Save 22 mins)'}
                  </span>
                </button>

                <button
                  onClick={() => handleRerouteClick('DAF-CAB-101')}
                  disabled={reroutingVehicleId === 'DAF-CAB-101'}
                  className="btn-ghost"
                  style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                >
                  <Zap size={14} />
                  <span>Execute Reroute for Mobility Cab DAF-CAB-101</span>
                </button>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              Select a disruption scenario on the left to inspect the predictive graph.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

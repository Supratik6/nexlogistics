import React, { useEffect, useRef } from 'react';
import { 
  Truck, 
  ThermometerSnowflake, 
  Lock, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function FreightTab({ vehicles, onSelectVehicle }) {
  const freightUnits = vehicles.filter(v => v.type === 'FREIGHT');
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div style={{ padding: '0 18px 24px 18px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-status badge-indigo">
              SUPPLY CHAIN PILLAR 2
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Daffodils Cold-Chain & Multi-Waypoint Logistics Matrix
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
            Enterprise Freight & Cold-Chain Telematics
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="glass-card" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThermometerSnowflake size={16} color="#818cf8" />
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Cold-Chain Compliance: <strong style={{ color: '#34d399' }}>99.8% SLA</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Freight Telematics & Multi-Stop Manifests */}
      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(320px, 1fr)', gap: '18px' }}>
        
        {/* Left Column: Cold Chain Sensor Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {freightUnits.map(unit => (
            <div key={unit.id} className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '15px', fontWeight: '800', color: '#818cf8' }}>
                      {unit.id}
                    </span>
                    <span className="badge-status badge-indigo" style={{ fontSize: '10px' }}>
                      {unit.subType}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', marginTop: '3px' }}>
                    Mission: {unit.missionId} ({unit.cargoType})
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Driver: {unit.driverName} • Plate: {unit.plate}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>SPEED</div>
                  <div className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8' }}>
                    {unit.speedKmh} km/h
                  </div>
                </div>
              </div>

              {/* IoT Environmental Sensors Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                
                <div className="glass-card" style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ThermometerSnowflake size={12} color="#818cf8" />
                    <span>REEFER TEMP</span>
                  </div>
                  <div className="mono" style={{ fontSize: '18px', fontWeight: '800', color: '#818cf8', marginTop: '2px' }}>
                    {unit.temperatureC}°C
                  </div>
                  <div style={{ fontSize: '10px', color: '#10b981' }}>
                    Target: {unit.targetTempC}°C (Optimal)
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={12} color="#10b981" />
                    <span>CARGO SEAL</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>
                    CRYPT-LOCKED
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    Zero Breach Events
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>SLA RISK INDEX</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#34d399', marginTop: '4px' }}>
                    LOW (1.4%)
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    On Schedule
                  </div>
                </div>

              </div>

              {/* Waypoint Progress */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', fontSize: '12px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Destination Waypoint
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9' }}>
                    <MapPin size={14} color="#818cf8" />
                    <strong>{unit.destinationName}</strong>
                  </div>
                  <span className="mono" style={{ color: '#f59e0b', fontWeight: '700' }}>
                    ETA: {unit.etaMinutes} mins
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => onSelectVehicle(unit)}
                  className="btn-primary"
                  style={{
                    fontSize: '11.5px',
                    padding: '6px 14px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)'
                  }}
                >
                  <Truck size={14} />
                  <span>Inspect Telematics on GIS Map</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right Column: Multi-Stop Supply Chain Waypoint Schedule */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#818cf8" />
            <span>Pharma Waypoint Manifest Checklist</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { stop: 'Depot Alpha (Kolkata Port Logistics Hub)', status: 'COMPLETED & SEAL VERIFIED', time: '07:15 AM', done: true },
              { stop: 'Salt Lake Biotech Central Warehouse', status: 'IN TRANSIT (TEMP: -19.4°C)', time: 'ETA 28 Mins', done: false, active: true },
              { stop: 'Apollo Med-Logistics Receiving Dock', status: 'PENDING DOCK ALLOCATION', time: 'Est. 15:45', done: false },
              { stop: 'AMRI Specialized Care Clinic Hub', status: 'PENDING', time: 'Est. 17:00', done: false }
            ].map((node, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '12px 14px', borderLeft: node.active ? '3px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {node.done ? (
                      <CheckCircle2 size={16} color="#10b981" />
                    ) : node.active ? (
                      <span className="pulsing-green-dot"></span>
                    ) : (
                      <Clock size={16} color="#64748b" />
                    )}
                    <span style={{ fontSize: '12.5px', fontWeight: '600', color: node.done ? '#94a3b8' : '#ffffff' }}>
                      Stop {idx + 1}: {node.stop}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: '11px', color: node.active ? '#38bdf8' : '#94a3b8' }}>
                    {node.time}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: node.active ? '#818cf8' : '#64748b', marginTop: '4px', marginLeft: '24px' }}>
                  {node.status}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

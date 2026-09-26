import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Car, 
  Truck, 
  Package, 
  Siren, 
  BrainCircuit, 
  Cpu,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';
import { i18n } from '../services/i18nService';

export default function Navigation({ 
  activeTab, 
  setActiveTab, 
  vehicles, 
  emergencyCount, 
  disruptionCount,
  currentUser 
}) {
  const [lang, setLang] = useState(i18n.getLanguage());
  const navContainerRef = useRef(null);

  useEffect(() => {
    const unsub = i18n.subscribe((l) => setLang(l));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (navContainerRef.current) {
      gsap.fromTo(navContainerRef.current.children,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [currentUser?.role, lang]);

  const isControlRoom = currentUser?.role === 'CONTROL_ROOM';

  // Role-adapted tabs with i18n translations
  const tabs = isControlRoom ? [
    {
      id: 'map',
      label: i18n.t('tabMap', 'GIS Command Matrix'),
      icon: MapPin,
      badge: `${vehicles?.length || 5} ${i18n.t('active', 'Active')}`,
      badgeType: 'badge-cyan',
      description: 'Master GIS Fleet Telemetry & Multi-Modal Routing'
    },
    {
      id: 'mobility',
      label: i18n.t('tabMobility', 'On-Demand Mobility'),
      icon: Car,
      badge: i18n.t('dispatch', 'Live Dispatch'),
      badgeType: 'badge-emerald',
      description: 'Cab Fleet Dispatch & Autonomous Ride Matching'
    },
    {
      id: 'freight',
      label: i18n.t('tabFreight', 'Enterprise Freight'),
      icon: Truck,
      badge: 'Cold-Chain SLA',
      badgeType: 'badge-indigo',
      description: 'Heavy Cargo & Cold Storage SLA Telemetry'
    },
    {
      id: 'movers',
      label: i18n.t('tabMovers', 'Packers & Movers'),
      icon: Package,
      badge: 'Volumetric',
      badgeType: 'badge-purple',
      description: 'Turnkey Relocation & Truck Allocation Matrix'
    },
    {
      id: 'ambulance',
      label: i18n.t('tabAmbulance', 'Lifeline Emergency'),
      icon: Siren,
      badge: emergencyCount > 0 ? `${emergencyCount} Priority-0` : i18n.t('standby', 'Standby'),
      badgeType: 'badge-crimson',
      description: 'Code-Red Signal Preemption & Hospital Routing'
    },
    {
      id: 'disruption',
      label: i18n.t('tabDisruption', 'Disruption & Continuity'),
      icon: BrainCircuit,
      badge: disruptionCount > 0 ? `${disruptionCount} Hazards` : i18n.t('clear', 'Clear'),
      badgeType: 'badge-amber',
      description: 'Disruption Injection Sandbox & Corridor Healing'
    },
    {
      id: 'ai-studio',
      label: i18n.t('tabAiStudio', 'Multimodal AI & CV'),
      icon: Cpu,
      badge: 'Vision AI',
      badgeType: 'badge-cyan',
      description: 'Computer Vision Damage Scanner & Voice Ops'
    }
  ] : [
    {
      id: 'mobility',
      label: i18n.t('commuterTabMobility', 'Book Cab & Ride'),
      icon: Car,
      badge: 'Fast Dispatch',
      badgeType: 'badge-emerald',
      description: 'Instant EV Cab Booking, Live OTP & Trip Status'
    },
    {
      id: 'movers',
      label: i18n.t('commuterTabMovers', 'Packers & Movers'),
      icon: Package,
      badge: '3D Estimate',
      badgeType: 'badge-purple',
      description: 'Calculate Luggage Volume & Instant Relocation'
    },
    {
      id: 'map',
      label: i18n.t('commuterTabMap', 'Live Ride Tracker'),
      icon: MapPin,
      badge: 'Live GPS',
      badgeType: 'badge-cyan',
      description: 'Track your assigned vehicle in real-time'
    },
    {
      id: 'ambulance',
      label: i18n.t('commuterTabAmbulance', 'Emergency Aid'),
      icon: Siren,
      badge: emergencyCount > 0 ? 'Active Alert' : '24/7 Available',
      badgeType: 'badge-crimson',
      description: 'Request Immediate ALS Emergency Ambulance'
    },
    {
      id: 'disruption',
      label: i18n.t('commuterTabDisruption', 'City Traffic Advisory'),
      icon: BrainCircuit,
      badge: disruptionCount > 0 ? `${disruptionCount} Alerts` : i18n.t('clear', 'Clear'),
      badgeType: 'badge-amber',
      description: 'View Active Traffic Bottlenecks & Smart Detours'
    },
    {
      id: 'ai-studio',
      label: i18n.t('commuterTabAiStudio', 'AI Luggage Estimator'),
      icon: Cpu,
      badge: 'Vision CV',
      badgeType: 'badge-cyan',
      description: 'Scan household cargo & ask voice assistant'
    }
  ];

  const handleTabChange = (tabId, e) => {
    setActiveTab(tabId);
    soundFx.playRadarPing();
    
    if (e?.currentTarget) {
      gsap.fromTo(e.currentTarget,
        { scale: 0.94 },
        { scale: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    }
  };

  return (
    <nav style={{ margin: '0 18px 12px 18px' }}>
      <div 
        ref={navContainerRef}
        className="glass-panel" 
        style={{ 
          padding: '6px 12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '8px', 
          overflowX: 'auto' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={(e) => handleTabChange(tab.id, e)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '9px 15px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(6, 182, 212, 0.14) 100%)' 
                    : 'transparent',
                  color: isActive ? '#fde68a' : '#94a3b8',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '12.5px',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 0 16px rgba(245, 158, 11, 0.2)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <Icon size={15} color={isActive ? '#fbbf24' : '#94a3b8'} />
                <span>{tab.label}</span>
                <span className={`badge-status ${tab.badgeType}`} style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Role Portal Indicator Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          borderRadius: '8px',
          background: isControlRoom ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
          border: isControlRoom ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
          whiteSpace: 'nowrap',
          marginLeft: '8px'
        }}>
          {isControlRoom ? (
            <>
              <ShieldCheck size={14} color="#fbbf24" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#fbbf24', letterSpacing: '0.04em' }}>
                CONTROL ROOM HQ
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Level 5</span>
            </>
          ) : (
            <>
              <UserCheck size={14} color="#10b981" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', letterSpacing: '0.04em' }}>
                COMMUTATOR PORTAL
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Verified</span>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

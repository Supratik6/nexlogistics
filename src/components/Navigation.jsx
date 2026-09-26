import React, { useEffect, useRef } from 'react';
import { 
  MapPin, 
  Car, 
  Truck, 
  Package, 
  Siren, 
  BrainCircuit, 
  Cpu 
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function Navigation({ activeTab, setActiveTab, vehicles, emergencyCount, disruptionCount }) {
  const navContainerRef = useRef(null);

  useEffect(() => {
    if (navContainerRef.current) {
      gsap.fromTo(navContainerRef.current.children,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, []);

  const tabs = [
    {
      id: 'map',
      label: 'GIS Command Matrix',
      icon: MapPin,
      badge: `${vehicles?.length || 5} Active`,
      badgeType: 'badge-cyan'
    },
    {
      id: 'mobility',
      label: 'On-Demand Mobility',
      icon: Car,
      badge: 'Live Dispatch',
      badgeType: 'badge-emerald'
    },
    {
      id: 'freight',
      label: 'Enterprise Freight',
      icon: Truck,
      badge: 'Cold-Chain SLA',
      badgeType: 'badge-indigo'
    },
    {
      id: 'movers',
      label: 'Packers & Movers',
      icon: Package,
      badge: 'Volumetric Engine',
      badgeType: 'badge-purple'
    },
    {
      id: 'ambulance',
      label: 'Lifeline Emergency',
      icon: Siren,
      badge: emergencyCount > 0 ? `${emergencyCount} Priority-0` : 'Standby',
      badgeType: 'badge-crimson'
    },
    {
      id: 'disruption',
      label: 'Disruption & Continuity',
      icon: BrainCircuit,
      badge: disruptionCount > 0 ? `${disruptionCount} Hazards` : 'Clear',
      badgeType: 'badge-amber'
    },
    {
      id: 'ai-studio',
      label: 'Multimodal AI & CV',
      icon: Cpu,
      badge: 'Voice + Vision',
      badgeType: 'badge-cyan'
    }
  ];

  const handleTabChange = (tabId, e) => {
    setActiveTab(tabId);
    soundFx.playRadarPing();
    
    // GSAP Micro-click bounce
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
        style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}
      >
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
                padding: '10px 16px',
                borderRadius: '10px',
                border: isActive ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(6, 182, 212, 0.14) 100%)' 
                  : 'transparent',
                color: isActive ? '#fde68a' : '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontSize: '13px',
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
              <Icon size={16} color={isActive ? '#fbbf24' : '#94a3b8'} />
              <span>{tab.label}</span>
              <span className={`badge-status ${tab.badgeType}`} style={{ fontSize: '10px', padding: '2px 7px' }}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

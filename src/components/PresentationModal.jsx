import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Presentation,
  ShieldCheck,
  Award
} from 'lucide-react';
import gsap from 'gsap';
import { notificationService } from '../services/notificationService';
import { soundFx } from '../services/soundService';

const STORYBOARD_STEPS = [
  {
    step: 1,
    title: 'Urban Telematics & GIS Command Matrix',
    tabId: 'map',
    durationSec: 10,
    subtitle: 'Real-Time Spatial Grid & Telemetry Ingestion Layer',
    badge: 'CORE TELEMETRY',
    summary: 'The platform ingests live telemetry across Kolkata metropolitan corridors, tracking EV cabs, cold-chain freight, relocation haulers, and emergency ambulances on open-source OpenStreetMap vector tiles.',
    keyPoints: [
      'Zero external API key lock-in with free cyber-dark cartography',
      'Dynamic coordinate interpolation simulating real vehicular GPS drift',
      'Unified spatial layer integrating multi-modal transit networks'
    ],
    narration: 'Step 1: The Daffodils Urban GIS Matrix ingests real-time telemetry across multi-modal fleets with zero API key dependencies.'
  },
  {
    step: 2,
    title: 'Pillar 1: On-Demand Zero-Emission Mobility',
    tabId: 'mobility',
    durationSec: 10,
    subtitle: 'Dynamic EV Fleet Dispatch & Trip Tax Invoicing',
    badge: 'CONSUMER MOBILITY',
    summary: 'Passengers request on-demand EV rides. The spatial matching engine assigns the nearest driver (e.g. Rameshwar Mahato in WB-02-B-3788), generates a secure Start-Trip OTP, and produces an instant GST-compliant trip invoice.',
    keyPoints: [
      'Spatial sonar proximity matching minimizes commuter wait times',
      'Start-Trip 4-digit OTP prevents fraud and validates custody',
      'Instant electronic tax invoice generation with SAC code 996412'
    ],
    narration: 'Step 2: On-Demand Mobility delivers rapid EV matching, start-trip OTP verification, and instant GST tax receipts.'
  },
  {
    step: 3,
    title: 'Pillar 2: Enterprise Cold-Chain Freight',
    tabId: 'freight',
    durationSec: 10,
    subtitle: 'Pharmaceutical & Perishable SLA Telematics',
    badge: 'ENTERPRISE FREIGHT',
    summary: 'Heavy freight carriers feature IoT temperature sensors monitoring vaccine cargo bays between 2°C and 8°C. Any temperature anomaly triggers an instant reroute to prevent spoilage.',
    keyPoints: [
      'Live IoT payload and temperature sensor telemetry feeds',
      'Automated breach alerting and cold-chain compliance guarantees',
      'SLA tracking for high-value logistics and industrial cargo'
    ],
    narration: 'Step 3: Enterprise Freight secures pharmaceutical cold-chain cargo with continuous thermal IoT monitoring and SLA enforcement.'
  },
  {
    step: 4,
    title: 'Pillar 3: Packers & Movers Relocation Engine',
    tabId: 'movers',
    durationSec: 10,
    subtitle: '3D Volumetric Luggage Calculator & Custody Chain',
    badge: 'RELOCATION ENGINE',
    summary: 'Citizens configure their apartment move. The volumetric calculation engine aggregates furniture cubic feet, selects the exact hauler size, provides a 6-stage chain-of-custody tracking pipeline, and produces a printable relocation manifest.',
    keyPoints: [
      'Interactive room-by-room cubic feet volume calculation algorithm',
      '6-Stage transparent Chain-of-Custody verification pipeline',
      'Printable relocation manifest with QR code and transit insurance'
    ],
    narration: 'Step 4: Packers and Movers uses a volumetric calculator and a 6-stage chain of custody to prevent relocation moving scams.'
  },
  {
    step: 5,
    title: 'Pillar 4: Priority-0 Lifeline Emergency Corridor',
    tabId: 'ambulance',
    durationSec: 10,
    subtitle: 'Traffic Signal Preemption & Mobile ICU Dispatch',
    badge: 'EMERGENCY LIFELINE',
    summary: 'Emergency ambulances receive immediate Green Wave corridor priority. All traffic lights along the ambulance route dynamically lock to green, slashing transit times to trauma centers.',
    keyPoints: [
      'Code-Red Priority-0 preemption locks urban traffic signals green',
      'Seamless integration with Apollo Trauma and central hospitals',
      'Commuter SOS button broadcasts live device GPS to central dispatch'
    ],
    narration: 'Step 5: The Lifeline Emergency system pre-empts traffic signals, creating an autonomous green wave corridor for critical care ambulances.'
  },
  {
    step: 6,
    title: 'Pillar 5: Disruption Sandbox & Autonomous Continuity',
    tabId: 'disruption',
    durationSec: 10,
    subtitle: 'Heuristic Corridor Healing & Bottleneck Reroutes',
    badge: 'RESILIENCE ENGINE',
    summary: 'Evaluators can simulate real-world urban disruptions such as waterlogging, VIP motorcades, or metro breakdowns. Daffodils computes alternative green corridors in milliseconds.',
    keyPoints: [
      'Interactive sandbox injecting localized road hazards and closures',
      'Autonomous Dijkstra heuristic calculates alternate paths instantly',
      'Quantifies saved minutes and fuel economy before and after detour'
    ],
    narration: 'Step 6: The Disruption Sandbox simulates urban hazards and demonstrates autonomous corridor healing in real time.'
  },
  {
    step: 7,
    title: 'Pillars 6 & 7: Multimodal AI, ESG Impact & Defense',
    tabId: 'ai-studio',
    durationSec: 10,
    subtitle: 'Computer Vision Damage Scanner & Project Milestone',
    badge: 'ACADEMIC DEFENSE',
    summary: 'Computer Vision inspects luggage cargo for damage, while voice dispatch handles hands-free verbal commands. The platform tracks 340+ kg of CO2 saved, validating Phase 1 and 2 milestones at 68.4% completion.',
    keyPoints: [
      'Edge-ready Computer Vision bounding-box cargo damage inspection',
      'Conversational Voice AI copilot for natural language commands',
      'Phase 1 and 2 operational benchmark meeting all academic requirements'
    ],
    narration: 'Step 7: Multimodal AI vision, ESG carbon analytics, and role-based security complete our defense-ready capstone platform.'
  }
];

export default function PresentationModal({ isOpen, onClose, onNavigateTab }) {
  if (!isOpen) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [narrateAudio, setNarrateAudio] = useState(true);

  const modalRef = useRef(null);
  const currentStep = STORYBOARD_STEPS[currentStepIndex];

  // GSAP Modal Entrance
  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.5)' }
      );
    }
  }, [isOpen]);

  // Handle Tab Switch and Narration on Step Change
  useEffect(() => {
    if (onNavigateTab && currentStep) {
      onNavigateTab(currentStep.tabId);
    }
    if (narrateAudio && currentStep) {
      notificationService.speak(currentStep.narration);
    }
  }, [currentStepIndex]);

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < STORYBOARD_STEPS.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
          soundFx.playSuccessChime();
        }
      }, 9000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex]);

  const handleNext = () => {
    soundFx.playRadarPing();
    if (currentStepIndex < STORYBOARD_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    soundFx.playRadarPing();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleTogglePlay = () => {
    soundFx.playRadarPing();
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '900px',
      maxWidth: '94vw',
      background: 'rgba(9, 14, 26, 0.95)',
      border: '1.5px solid rgba(245, 158, 11, 0.5)',
      borderRadius: '20px',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.25)',
      zIndex: 9995,
      overflow: 'hidden',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      color: '#e2e8f0'
    }} ref={modalRef}>
      
      {/* Top Banner */}
      <div style={{
        padding: '12px 20px',
        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.22) 0%, rgba(6, 182, 212, 0.18) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Presentation size={18} color="#fbbf24" />
          <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.04em' }}>
            MENTOR EVALUATION STORYBOARD
          </span>
          <span className="badge-status badge-amber" style={{ fontSize: '10px' }}>
            STEP {currentStep.step} OF {STORYBOARD_STEPS.length}
          </span>
          <span style={{ fontSize: '11px', color: '#6ee7b7', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
            {currentStep.badge}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setNarrateAudio(!narrateAudio)}
            style={{
              background: narrateAudio ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: narrateAudio ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '4px 8px',
              color: narrateAudio ? '#6ee7b7' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={narrateAudio ? 'Voice Narration ON' : 'Voice Narration OFF'}
          >
            {narrateAudio ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>Voiceover</span>
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Storyboard Content Card */}
      <div style={{ padding: '18px 24px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Narrative description */}
        <div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginBottom: '3px' }}>
            {currentStep.title}
          </div>
          <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600', marginBottom: '10px' }}>
            {currentStep.subtitle}
          </div>
          <div style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
            {currentStep.summary}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {currentStep.keyPoints.map((pt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#94a3b8' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span style={{ color: '#e2e8f0' }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mini Timeline Progress & Step Nav */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>
              Storyboard Milestone Matrix:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {STORYBOARD_STEPS.map((s, idx) => (
                <div
                  key={s.step}
                  onClick={() => setCurrentStepIndex(idx)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: idx === currentStepIndex ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    border: idx === currentStepIndex ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: idx === currentStepIndex ? '#fbbf24' : '#94a3b8'
                  }}
                >
                  <span style={{ fontWeight: idx === currentStepIndex ? '700' : '400' }}>
                    {s.step}. {s.title.split(':')[0]}
                  </span>
                  {idx < currentStepIndex && <CheckCircle2 size={12} color="#10b981" />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '10.5px', color: '#6ee7b7', textAlign: 'center', background: 'rgba(16, 185, 129, 0.08)', padding: '5px', borderRadius: '6px' }}>
            Phase 1 & 2 Operational [68.4% Milestone Completed]
          </div>
        </div>

      </div>

      {/* Bottom Interactive Playback Controls */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(15, 23, 42, 0.85)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <SkipBack size={14} />
            <span>Previous</span>
          </button>

          <button
            onClick={handleTogglePlay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: isPlaying ? '#ef4444' : '#050811',
              border: isPlaying ? '1px solid #ef4444' : 'none',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause Auto-Play' : 'Auto-Play Storyboard'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === STORYBOARD_STEPS.length - 1}
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <span>Next</span>
            <SkipForward size={14} />
          </button>
        </div>

        <button
          onClick={() => {
            onNavigateTab(currentStep.tabId);
            onClose();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            color: '#67e8f9',
            fontSize: '11.5px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <span>Examine Live Screen</span>
          <ExternalLink size={13} />
        </button>
      </div>

    </div>
  );
}

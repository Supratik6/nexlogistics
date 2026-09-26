import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Mic, 
  Camera, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Volume2, 
  UploadCloud,
  Layers,
  ShieldCheck
} from 'lucide-react';
import gsap from 'gsap';
import { aiService } from '../services/aiService';
import { soundFx } from '../services/soundService';

export default function AIStudioTab() {
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceResponse, setVoiceResponse] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const [cvResult, setCvResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [ragQuery, setRagQuery] = useState('cold chain protocol');
  const [ragResult, setRagResult] = useState(aiService.queryOperationalKnowledge('cold chain protocol'));

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const handleStartVoice = () => {
    setIsListening(true);
    aiService.startVoiceListening(
      (res) => {
        setIsListening(false);
        setVoiceQuery(res.input);
        setVoiceResponse(res);
      },
      (err) => {
        setIsListening(false);
        const sampleQuery = 'Status of Ambulance Lifeline Corridor';
        aiService.handleVoiceCommand(sampleQuery, (res) => {
          setVoiceQuery(sampleQuery);
          setVoiceResponse(res);
        });
      }
    );
  };

  const handleSimulateVoice = (commandText) => {
    setVoiceQuery(commandText);
    aiService.handleVoiceCommand(commandText, (res) => {
      setVoiceResponse(res);
    });
  };

  const handleRunCV = (imageType) => {
    setIsScanning(true);
    soundFx.playRadarPing();
    setTimeout(() => {
      const result = aiService.analyzeCargoImage(imageType);
      setCvResult(result);
      setIsScanning(false);
    }, 1200);
  };

  const handleRagSearch = (e) => {
    e.preventDefault();
    soundFx.playRadarPing();
    const result = aiService.queryOperationalKnowledge(ragQuery);
    setRagResult(result);
  };

  return (
    <div style={{ padding: '0 18px 24px 18px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-status badge-cyan">
              MULTIMODAL INTELLIGENCE PILLAR 6
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Daffodils Conversational Voice AI, Computer Vision & RAG SOP Matrix
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
            Multimodal AI, Computer Vision & Operations Copilot
          </h2>
        </div>
      </div>

      {/* 3-Column AI Capabilities Grid */}
      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        
        {/* Module 1: Conversational Voice AI Dispatcher */}
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Mic size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '15px', color: '#ffffff' }}>Conversational Voice AI Dispatcher</h3>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
            Hands-free voice telemetry assistant for drivers and dispatchers using native browser Speech Synthesis & Recognition.
          </p>

          <button
            onClick={handleStartVoice}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginBottom: '14px' }}
          >
            <Mic size={16} />
            <span>{isListening ? 'Listening via Microphone...' : 'Speak Voice Command'}</span>
          </button>

          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
            Or test instant dispatch prompts:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {[
              'Status of Ambulance Lifeline Corridor',
              'Reroute freight around Maa Flyover',
              'Report on Movers Mission 881',
              'Overall fleet health report'
            ].map(p => (
              <button
                key={p}
                onClick={() => handleSimulateVoice(p)}
                className="btn-ghost"
                style={{ fontSize: '10.5px', padding: '4px 8px' }}
              >
                "{p}"
              </button>
            ))}
          </div>

          {voiceResponse && (
            <div className="glass-card" style={{ padding: '12px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <div style={{ fontSize: '10px', color: '#22d3ee', fontWeight: '700' }}>
                DAFFODILS VOICE RESPONSE:
              </div>
              <div style={{ fontSize: '12.5px', color: '#f8fafc', marginTop: '4px' }}>
                {voiceResponse.response}
              </div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Volume2 size={12} color="#06b6d4" />
                <span>Audio synthesized through Web Speech API</span>
              </div>
            </div>
          )}
        </div>

        {/* Module 2: Computer Vision Cargo / Vehicle Damage Inspector */}
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Camera size={18} color="#a855f7" />
            <h3 style={{ fontSize: '15px', color: '#ffffff' }}>Computer Vision Cargo & Seal Scanner</h3>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
            Inspects pre-move and in-transit cargo for seal tampering, structural deformation, and surface abrasions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            <button
              onClick={() => handleRunCV('Electronics Packaging Crate (Sample A)')}
              className="btn-ghost"
              style={{ fontSize: '11px', padding: '8px' }}
            >
              Scan Pharma Reefer Seal
            </button>
            <button
              onClick={() => handleRunCV('Household Glassware Carton (Sample B)')}
              className="btn-ghost"
              style={{ fontSize: '11px', padding: '8px' }}
            >
              Scan Fragile Furniture
            </button>
          </div>

          {isScanning ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span className="pulsing-green-dot"></span>
              <div style={{ fontSize: '12px', color: '#c084fc', marginTop: '8px' }}>
                Daffodils YOLO Neural Bounding Box Extraction...
              </div>
            </div>
          ) : cvResult ? (
            <div className="glass-card" style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '11px', color: '#c084fc' }}>
                  {cvResult.fileName}
                </span>
                <span className={`badge-status ${cvResult.damageDetected ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '9px' }}>
                  {cvResult.sealStatus}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#f8fafc', marginTop: '6px' }}>
                {cvResult.details}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                <span>Confidence: <strong style={{ color: '#fff' }}>{cvResult.confidenceScore}</strong></span>
                <span>Security: <strong style={{ color: '#34d399' }}>{cvResult.fragilityScore}</strong></span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '12px' }}>
              Select a sample scan above to simulate Computer Vision analysis.
            </div>
          )}
        </div>

        {/* Module 3: RAG Operational Knowledge Base */}
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FileText size={18} color="#10b981" />
            <h3 style={{ fontSize: '15px', color: '#ffffff' }}>RAG Operational Knowledge Hub</h3>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
            Retrieval-Augmented Generation over mission SOPs, cold-chain regulatory limits, and emergency triage rules.
          </p>

          <form onSubmit={handleRagSearch} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              placeholder="e.g. cold chain, ambulance, movers"
              className="glass-input"
              style={{ fontSize: '12px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>
              <Search size={14} />
            </button>
          </form>

          {ragResult && (
            <div className="glass-card" style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#34d399' }}>
                {ragResult.topic}
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                {ragResult.protocol}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

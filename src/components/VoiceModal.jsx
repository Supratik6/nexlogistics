import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Volume2, Sparkles, Radio } from 'lucide-react';
import gsap from 'gsap';
import { aiService } from '../services/aiService';

export default function VoiceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const modalBoxRef = useRef(null);

  useEffect(() => {
    if (modalBoxRef.current) {
      gsap.fromTo(modalBoxRef.current,
        { scale: 0.88, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.8)' }
      );
    }
  }, [isOpen]);

  const handleListen = () => {
    setIsListening(true);
    aiService.startVoiceListening(
      (res) => {
        setIsListening(false);
        setInputQuery(res.input);
        setResponse(res);
      },
      (err) => {
        setIsListening(false);
        const sample = 'Daffodils, check status of Ambulance 911';
        aiService.handleVoiceCommand(sample, (res) => {
          setInputQuery(sample);
          setResponse(res);
        });
      }
    );
  };

  const handleQuickPrompt = (prompt) => {
    setInputQuery(prompt);
    aiService.handleVoiceCommand(prompt, (res) => {
      setResponse(res);
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 17, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        ref={modalBoxRef}
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '24px',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.85)'
        }}
      >
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
              Daffodils Voice Copilot
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '18px' }}>
          Voice command hands-free interface for emergency response, reroute calculation, and fleet intelligence.
        </p>

        <button
          onClick={handleListen}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '14px', marginBottom: '16px', background: 'linear-gradient(135deg, #f59e0b 0%, #06b6d4 100%)' }}
        >
          <Mic size={18} />
          <span>{isListening ? 'Listening through Microphone...' : 'Press & Speak Command'}</span>
        </button>

        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
          Suggested Quick Invocations:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
          {[
            'Dispatch Code Red ambulance to Trauma Bay 3',
            'Daffodils, evaluate flood disruption on Maa Flyover',
            'Give me the relocation status for Mission 881'
          ].map(p => (
            <button
              key={p}
              onClick={() => handleQuickPrompt(p)}
              className="btn-ghost"
              style={{ fontSize: '11px', textAlign: 'left', padding: '8px 10px', justifyContent: 'flex-start' }}
            >
              "{p}"
            </button>
          ))}
        </div>

        {response && (
          <div className="glass-card" style={{ padding: '14px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '700' }}>
              DAFFODILS INTELLIGENCE:
            </div>
            <div style={{ fontSize: '13px', color: '#ffffff', marginTop: '4px' }}>
              {response.response}
            </div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Volume2 size={12} color="#fbbf24" />
              <span>Voice spoken via Web Speech API</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

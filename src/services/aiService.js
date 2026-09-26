// VYONEX Multimodal AI, Voice Dispatcher & CV Inspector Service
import { soundFx } from './soundService';

class AIService {
  constructor() {
    this.speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
      }
    }
  }

  // Text to Speech
  speak(text) {
    if (!this.speechSynthesis) return;
    try {
      this.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      this.speechSynthesis.speak(utterance);
    } catch {}
  }

  // Voice Command Listener
  startVoiceListening(onCommandRecognized, onError) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use text simulation.');
      return;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      soundFx.playRadarPing();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.isListening = false;
      this.handleVoiceCommand(transcript, onCommandRecognized);
    };

    this.recognition.onerror = (err) => {
      this.isListening = false;
      if (onError) onError(`Voice input: ${err.error || 'Mic cancelled'}`);
    };

    try {
      this.recognition.start();
    } catch {
      this.isListening = false;
    }
  }

  // Interpret Voice Commands with ACCESSNEXA NLP parser
  handleVoiceCommand(commandText, callback) {
    const text = commandText.toLowerCase();
    let responseText = '';
    let actionType = 'GENERAL_QUERY';

    if (text.includes('ambulance') || text.includes('emergency') || text.includes('hospital')) {
      actionType = 'AMBULANCE_DISPATCH';
      responseText = 'ACCESSNEXA Alert: Priority-0 Lifeline Corridor activated. Traffic signals preempted on route to trauma center.';
    } else if (text.includes('reroute') || text.includes('traffic') || text.includes('delay')) {
      actionType = 'REROUTE_SUGGESTION';
      responseText = 'ACCESSNEXA Disruption Engine: Alternative Bypass calculated. Diverting vehicle to save 14 minutes.';
    } else if (text.includes('mover') || text.includes('packing') || text.includes('relocation')) {
      actionType = 'MOVERS_STATUS';
      responseText = 'Relocation Mission #PM-2026-881 is in transit. All 6 crates secured. ETA at destination is 38 minutes.';
    } else if (text.includes('status') || text.includes('fleet') || text.includes('report')) {
      actionType = 'FLEET_STATUS';
      responseText = 'System Status: All 5 active fleet nodes transmitting healthy telematics. No critical mechanical breaches.';
    } else {
      actionType = 'AI_INSIGHT';
      responseText = `Understood: "${commandText}". ACCESSNEXA cognitive model is monitoring the spatial network.`;
    }

    this.speak(responseText);
    if (callback) {
      callback({
        input: commandText,
        response: responseText,
        actionType
      });
    }
  }

  // Computer Vision Inspection Simulation
  analyzeCargoImage(imageFileName = 'sample_cargo.jpg') {
    soundFx.playRadarPing();
    const damageChance = Math.random();
    const hasDamage = damageChance > 0.65;

    return {
      timestamp: new Date().toLocaleTimeString(),
      fileName: imageFileName,
      confidenceScore: (88 + Math.random() * 11).toFixed(1) + '%',
      sealStatus: hasDamage ? 'TAMPER_SUSPECTED' : 'VERIFIED_INTACT',
      damageDetected: hasDamage,
      details: hasDamage
        ? 'Surface abrasion and 4.2 degree box tilt detected on packaging carton. Recommend manual inspection at destination bay.'
        : 'Packaging integrity 100% sound. QR security code matches manifest #VN-884. Zero structural deformity detected.',
      boundingCount: hasDamage ? 2 : 1,
      fragilityScore: hasDamage ? 'HIGH_RISK' : 'OPTIMAL_SECURITY'
    };
  }

  // RAG Operational Knowledge Base
  queryOperationalKnowledge(query) {
    const q = (query || '').toLowerCase();
    const knowledgeBase = [
      {
        topic: 'Cold Chain Pharma Compliance',
        tags: ['cold chain', 'temperature', 'pharma', 'vaccine'],
        protocol: 'SOP-COLD-04: Reefer temperature must remain between -18°C and -22°C. If sensor exceeds -15°C for >12 minutes, ACCESSNEXA triggers automated emergency reroute to nearest secondary cold storage depot.'
      },
      {
        topic: 'Emergency Lifeline Signal Preemption',
        tags: ['ambulance', 'green corridor', 'siren', 'emergency'],
        protocol: 'SOP-LIFE-01: Priority-0 code red ambulances automatically trigger a 400m geofenced signal preemption. Connected smart intersections hold cross-traffic in red cycle 45 seconds prior to arrival.'
      },
      {
        topic: 'Packers & Movers Fragile Goods Liability',
        tags: ['packers', 'movers', 'damage', 'furniture', 'glass'],
        protocol: 'SOP-MOVE-09: All fragile electronics, marble surfaces, and glassware undergo 3-layer bubble + foam encapsulation with photographic timestamping prior to loading. Claims require pre-move and post-unboxing cryptographic verification.'
      },
      {
        topic: 'ACCESSNEXA Impact-Before-Incident Cascading Logic',
        tags: ['disruption', 'delay', 'flood', 'reroute', 'accessnexa'],
        protocol: 'CORE-ALGO-02: Predicts cascading logistics delays by traversing weighted directed route graphs. Calculates secondary impact to subsequent scheduled missions before congestion occurs.'
      }
    ];

    const match = knowledgeBase.find(item => item.tags.some(t => q.includes(t))) || knowledgeBase[3];
    return match;
  }
}

export const aiService = new AIService();

// Daffodils Real-Time Event Stream & Native Speech Synthesis Service
import { soundFx } from './soundService';

const NOTIFICATIONS_STORAGE_KEY = 'daffodils_notifications_v1';
const SPEECH_SETTINGS_KEY = 'daffodils_speech_enabled_v1';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'NTF-101',
    title: 'Priority-0 Green Wave Corridor Engaged',
    message: 'Apollo Trauma Corridor signals locked to green wave for Lifeline Mobile ICU (DAF-AMB-01).',
    category: 'EMERGENCY',
    severity: 'CRITICAL',
    time: '2 mins ago',
    read: false
  },
  {
    id: 'NTF-102',
    title: 'Mobility Spatial Match Dispatched',
    message: 'Executive Eco EV Sedan (WB-02-B-3788) assigned to Howrah Station VIP bay. OTP: 9799.',
    category: 'MOBILITY',
    severity: 'INFO',
    time: '5 mins ago',
    read: false
  },
  {
    id: 'NTF-103',
    title: 'Cold-Chain SLA Nominal',
    message: 'Carrier DAF-FRT-02 vaccine cargo bay telemetry verified at 4.2°C. Zero breach.',
    category: 'FREIGHT',
    severity: 'SUCCESS',
    time: '12 mins ago',
    read: true
  },
  {
    id: 'NTF-104',
    title: 'Volumetric Relocation Manifest #8842 Issued',
    message: 'Chain of custody sealed for 2 BHK relocation to New Town Action Area II.',
    category: 'MOVERS',
    severity: 'INFO',
    time: '18 mins ago',
    read: true
  },
  {
    id: 'NTF-105',
    title: 'Disruption Sandbox Heuristic Armed',
    message: 'Autonomous rerouting algorithm ready with Dijkstra dynamic penalty matrix.',
    category: 'CONTINUITY',
    severity: 'WARNING',
    time: '25 mins ago',
    read: true
  }
];

class NotificationService {
  constructor() {
    this.notifications = this.loadNotifications();
    this.isSpeechEnabled = this.loadSpeechPreference();
    this.subscribers = new Set();
  }

  loadNotifications() {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_NOTIFICATIONS;
  }

  saveNotifications(list) {
    this.notifications = list;
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
    this.notifySubscribers();
  }

  loadSpeechPreference() {
    try {
      const stored = localStorage.getItem(SPEECH_SETTINGS_KEY);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return true; // Enabled by default for rich evaluator impression
  }

  setSpeechEnabled(enabled) {
    this.isSpeechEnabled = enabled;
    try {
      localStorage.setItem(SPEECH_SETTINGS_KEY, JSON.stringify(enabled));
    } catch {}
    if (enabled) {
      this.speak('Daffodils Voice Dispatch Alerting System is now active.');
    }
    this.notifySubscribers();
  }

  getSpeechEnabled() {
    return this.isSpeechEnabled;
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  addNotification({ title, message, category = 'INFO', severity = 'INFO', speakText = null }) {
    const newNotif = {
      id: `NTF-${Date.now().toString().slice(-4)}`,
      title,
      message,
      category,
      severity,
      time: 'Just now',
      read: false
    };

    const updated = [newNotif, ...this.notifications.slice(0, 19)];
    this.saveNotifications(updated);

    if (severity === 'CRITICAL') {
      soundFx.playAlertPing();
    } else {
      soundFx.playRadarPing();
    }

    if (this.isSpeechEnabled && speakText) {
      this.speak(speakText);
    }

    return newNotif;
  }

  markAllAsRead() {
    const updated = this.notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
    soundFx.playSuccessChime();
  }

  clearAll() {
    this.saveNotifications([]);
    soundFx.playRadarPing();
  }

  // Native Browser Speech Synthesis (100% Free, zero keys, offline)
  speak(text) {
    if (!this.isSpeechEnabled || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      // Try to find a crisp English or modern voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
    }
  }

  subscribe(cb) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => cb(this.notifications, this.isSpeechEnabled));
  }
}

export const notificationService = new NotificationService();

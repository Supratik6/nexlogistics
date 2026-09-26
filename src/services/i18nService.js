// Daffodils Multi-Language Localization Service (English, বাংলা Bengali, हिंदी Hindi)
import { soundFx } from './soundService';

const LANG_STORAGE_KEY = 'daffodils_lang_v1';

const TRANSLATIONS = {
  EN: {
    // Brand & Header
    brandTagline: 'Real-Time Mobility, Logistics & Continuity Intelligence Platform',
    motto: '“From Where Things Are → To What Happens Next”',
    evaluationStatus: 'SYSTEM EVALUATION STATUS',
    milestoneBadge: 'PHASE 1 & 2 ACTIVE [68.4% MILESTONE COMPLETED]',
    controlRoomCommander: '🛡️ CONTROL ROOM COMMANDER',
    commutatorClient: '🚗 COMMUTATOR CLIENT',
    switchToCommutator: 'Switch to Commutator',
    switchToControlRoom: 'Switch to Control Room',
    emergencySos: 'EMERGENCY SOS',
    voiceAi: 'Voice AI',
    reset: 'Reset',
    storyboard: 'Mentor Storyboard',
    analytics: 'ESG Analytics',
    blueprint: 'Architecture Blueprint',

    // Navigation Tabs
    tabMap: 'GIS Command Matrix',
    tabMobility: 'On-Demand Mobility',
    tabFreight: 'Enterprise Freight',
    tabMovers: 'Packers & Movers',
    tabAmbulance: 'Lifeline Emergency',
    tabDisruption: 'Disruption & Continuity',
    tabAiStudio: 'Multimodal AI & CV',

    // Commutator Tabs
    commuterTabMobility: 'Book Cab & Ride',
    commuterTabMovers: 'Packers & Movers',
    commuterTabMap: 'Live Ride Tracker',
    commuterTabAmbulance: 'Emergency Aid',
    commuterTabDisruption: 'City Traffic Advisory',
    commuterTabAiStudio: 'AI Luggage Estimator',

    // Common
    active: 'Active',
    dispatch: 'Live Dispatch',
    standby: 'Standby',
    clear: 'Clear',
    notifications: 'Live Notifications',
    markAllRead: 'Mark all as read',
    clearNotifications: 'Clear logs',
    speakAlerts: 'Voice Alerts'
  },
  BN: {
    // Brand & Header
    brandTagline: 'রিয়েল-টাইম মোবিলিটি, লজিস্টিকস ও নিরবচ্ছিন্নতা বুদ্ধিমত্তা প্ল্যাটফর্ম',
    motto: '“যেখানে জিনিসগুলি রয়েছে → ভবিষ্যতে কী ঘটবে”',
    evaluationStatus: 'সিস্টেম মূল্যায়ন স্ট্যাটাস',
    milestoneBadge: 'ফেজ ১ ও ২ সক্রিয় [৬৮.৪% সম্পন্ন]',
    controlRoomCommander: '🛡️ কন্ট্রোল রুম কমান্ডার',
    commutatorClient: '🚗 যাত্রী ও ক্লায়েন্ট',
    switchToCommutator: 'যাত্রী পোর্টালে যান',
    switchToControlRoom: 'কন্ট্রোল রুমে যান',
    emergencySos: 'জরুরি এসওএস',
    voiceAi: 'ভয়েস এআই',
    reset: 'রিসেট',
    storyboard: 'প্রেজেন্টেশন ডেমো',
    analytics: 'ইএসজি অ্যানালিটিক্স',
    blueprint: 'আর্কিটেকচার ব্লুপ্রিন্ট',

    // Navigation Tabs
    tabMap: 'জিআইএস কমান্ড ম্যাট্রিক্স',
    tabMobility: 'অন-ডিমান্ড মোবিলিটি',
    tabFreight: 'এন্টারপ্রাইজ মালবাহী পরিবহন',
    tabMovers: 'প্যাকার্স অ্যান্ড মুভার্স',
    tabAmbulance: 'লাইফলাইন জরুরি অ্যাম্বুলেন্স',
    tabDisruption: 'বিঘ্ন ও নিরবচ্ছিন্নতা',
    tabAiStudio: 'মাল্টিমোডাল এআই ও ভিশন',

    // Commutator Tabs
    commuterTabMobility: 'ক্যাব ও রাইড বুকিং',
    commuterTabMovers: 'প্যাকার্স অ্যান্ড মুভার্স',
    commuterTabMap: 'লাইভ রাইড ট্র্যাকার',
    commuterTabAmbulance: 'জরুরি চিকিৎসা সহায়তা',
    commuterTabDisruption: 'শহরের ট্রাফিক পরামর্শ',
    commuterTabAiStudio: 'এআই লাগেজ ক্যালকুলেটর',

    // Common
    active: 'সক্রিয়',
    dispatch: 'লাইভ ডেসপ্যাচ',
    standby: 'স্ট্যান্ডবাই',
    clear: 'স্বাভাবিক',
    notifications: 'লাইভ নোটিফিকেশন',
    markAllRead: 'সব পড়া হয়েছে',
    clearNotifications: 'লগ মুছুন',
    speakAlerts: 'ভয়েস অ্যালার্ট'
  },
  HI: {
    // Brand & Header
    brandTagline: 'रीयल-टाइम गतिशीलता, लॉजिस्टिक्स एवं निरंतरता इंटेलिजेंस प्लेटफॉर्म',
    motto: '“चीजें जहाँ हैं → आगे क्या होगा”',
    evaluationStatus: 'सिस्टम मूल्यांकन स्थिति',
    milestoneBadge: 'चरण 1 और 2 सक्रिय [68.4% पूर्ण]',
    controlRoomCommander: '🛡️ कंट्रोल रूम कमांडर',
    commutatorClient: '🚗 यात्री एवं ग्राहक',
    switchToCommutator: 'यात्री पोर्टल पर जाएं',
    switchToControlRoom: 'कंट्रोल रूम पर जाएं',
    emergencySos: 'आपातकालीन एसओएस',
    voiceAi: 'वॉयस एआई',
    reset: 'रीसेट',
    storyboard: 'प्रेजेंटेशन डेमो',
    analytics: 'ईएसजी एनालिटिक्स',
    blueprint: 'आर्किटेक्चर ब्लूप्रिंट',

    // Navigation Tabs
    tabMap: 'जीआईएस कमांड मैट्रिक्स',
    tabMobility: 'ऑन-डिमांड गतिशीलता',
    tabFreight: 'एंटरप्राइज माल ढुलाई',
    tabMovers: 'पैकर्स एंड मूवर्स',
    tabAmbulance: 'लाइफलाइन एम्बुलेंस',
    tabDisruption: 'व्यवधान एवं निरंतरता',
    tabAiStudio: 'मल्टीमॉडल एआई एवं विज़न',

    // Commutator Tabs
    commuterTabMobility: 'कैब व राइड बुकिंग',
    commuterTabMovers: 'पैकर्स एंड मूवर्स',
    commuterTabMap: 'लाइव राइड ट्रैकर',
    commuterTabAmbulance: 'आपातकालीन चिकित्सा सहायता',
    commuterTabDisruption: 'ट्रैफिक परामर्श',
    commuterTabAiStudio: 'एआई सामान वॉल्यूम',

    // Common
    active: 'सक्रिय',
    dispatch: 'लाइव डिस्पैच',
    standby: 'स्टैंडबाय',
    clear: 'सामान्य',
    notifications: 'लाइव सूचनाएं',
    markAllRead: 'सभी पढ़ें',
    clearNotifications: 'लॉग साफ़ करें',
    speakAlerts: 'वॉयस अलर्ट'
  }
};

class I18nService {
  constructor() {
    this.currentLang = this.loadLanguage();
    this.subscribers = new Set();
  }

  loadLanguage() {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored && ['EN', 'BN', 'HI'].includes(stored)) return stored;
    } catch {}
    return 'EN';
  }

  setLanguage(lang) {
    if (!['EN', 'BN', 'HI'].includes(lang)) return;
    this.currentLang = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
    soundFx.playRadarPing();
    this.notifySubscribers();
  }

  getLanguage() {
    return this.currentLang;
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.EN;
    return dict[key] || TRANSLATIONS.EN[key] || fallback || key;
  }

  subscribe(cb) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => cb(this.currentLang));
  }
}

export const i18n = new I18nService();

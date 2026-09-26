import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MapView from './components/MapView';
import MobilityTab from './components/MobilityTab';
import FreightTab from './components/FreightTab';
import PackersMoversTab from './components/PackersMoversTab';
import AmbulanceTab from './components/AmbulanceTab';
import DisruptionSimulator from './components/DisruptionSimulator';
import AIStudioTab from './components/AIStudioTab';
import VoiceModal from './components/VoiceModal';
import AuthModal from './components/AuthModal';
import InvoiceModal from './components/InvoiceModal';
import SosModal from './components/SosModal';
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import { soundFx } from './services/soundService';
import gsap from 'gsap';

export default function App() {
  const [appState, setAppState] = useState(storageService.getState());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('map');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Modals state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  const mainViewRef = useRef(null);

  // Subscribe to storage service updates (includes 2s simulated telemetry ticker)
  useEffect(() => {
    const unsubscribe = storageService.subscribe((newState) => {
      setAppState({ ...newState });
      if (selectedVehicle) {
        const updated = newState.vehicles.find(v => v.id === selectedVehicle.id);
        if (updated) setSelectedVehicle(updated);
      }
    });
    return () => unsubscribe();
  }, [selectedVehicle]);

  // Subscribe to auth service state changes
  useEffect(() => {
    const unsubscribeAuth = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // When role changes, ensure active tab is appropriate
  useEffect(() => {
    if (currentUser?.role === 'COMMUTATOR' && activeTab === 'freight') {
      setActiveTab('mobility');
    }
  }, [currentUser?.role, activeTab]);

  // GSAP Smooth Tab View Transition
  useEffect(() => {
    if (mainViewRef.current) {
      gsap.fromTo(mainViewRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleReset = () => {
    storageService.resetToDefault();
    setSelectedVehicle(null);
  };

  const handleBookRide = (bookingData) => {
    return storageService.createRideBooking(bookingData);
  };

  const handleCreateMoversOrder = (orderData) => {
    return storageService.createPackersMoversOrder(orderData);
  };

  const handleDispatchAmbulance = (ambulanceRequest) => {
    return storageService.dispatchAmbulance(ambulanceRequest);
  };

  const handleToggleDisruption = (disruptionId) => {
    storageService.toggleDisruption(disruptionId);
  };

  const handleExecuteReroute = (vehicleId) => {
    storageService.executeAutonomousReroute(vehicleId);
  };

  const handleSelectVehicleFromAnywhere = (veh) => {
    setSelectedVehicle(veh);
    setActiveTab('map');
    soundFx.playRadarPing();
  };

  const handleOpenInvoice = (data) => {
    setInvoiceData(data);
    setIsInvoiceModalOpen(true);
  };

  const handleSwitchRole = (targetRole) => {
    authService.switchRole(targetRole);
    if (targetRole === 'COMMUTATOR') {
      setActiveTab('mobility');
    } else {
      setActiveTab('map');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'radial-gradient(ellipse at top, #0d1527 0%, #050811 100%)' }}>
      
      {/* Top Command Header with User Profile Capsule & Emergency SOS */}
      <Header
        system={appState.system}
        currentUser={currentUser}
        onReset={handleReset}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onSwitchRole={handleSwitchRole}
      />

      {/* Primary Navigation Tabs with Role Adaptation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vehicles={appState.vehicles}
        emergencyCount={appState.emergencyAlerts.length}
        disruptionCount={appState.disruptions.filter(d => d.active).length}
        currentUser={currentUser}
      />

      {/* Main Dynamic Viewport with GSAP Smooth Transition */}
      <main ref={mainViewRef} style={{ flex: 1 }}>
        {activeTab === 'map' && (
          <div style={{ padding: '0 18px 18px 18px' }}>
            <MapView
              vehicles={appState.vehicles}
              disruptions={appState.disruptions}
              emergencyAlerts={appState.emergencyAlerts}
              onSelectVehicle={setSelectedVehicle}
              selectedVehicle={selectedVehicle}
            />
          </div>
        )}

        {activeTab === 'mobility' && (
          <MobilityTab
            vehicles={appState.vehicles}
            onBookRide={handleBookRide}
            onSelectVehicle={handleSelectVehicleFromAnywhere}
            onOpenInvoice={handleOpenInvoice}
          />
        )}

        {activeTab === 'freight' && (
          <FreightTab
            vehicles={appState.vehicles}
            onSelectVehicle={handleSelectVehicleFromAnywhere}
          />
        )}

        {activeTab === 'movers' && (
          <PackersMoversTab
            orders={appState.packersMoversOrders}
            onCreateOrder={handleCreateMoversOrder}
            onSelectVehicle={handleSelectVehicleFromAnywhere}
            vehicles={appState.vehicles}
            onOpenInvoice={handleOpenInvoice}
          />
        )}

        {activeTab === 'ambulance' && (
          <AmbulanceTab
            emergencyAlerts={appState.emergencyAlerts}
            onDispatchAmbulance={handleDispatchAmbulance}
            onSelectVehicle={handleSelectVehicleFromAnywhere}
            vehicles={appState.vehicles}
          />
        )}

        {activeTab === 'disruption' && (
          <DisruptionSimulator
            disruptions={appState.disruptions}
            onToggleDisruption={handleToggleDisruption}
            onExecuteReroute={handleExecuteReroute}
            vehicles={appState.vehicles}
          />
        )}

        {activeTab === 'ai-studio' && (
          <AIStudioTab />
        )}
      </main>

      {/* Floating Voice Assistant Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Full RBAC Auth Modal (Login / Sign Up / Forgot Password / Quick 1-Click Pills) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Digital Relocation Manifest & Tax Invoice Printable Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoiceData={invoiceData}
      />

      {/* Commuter Code-Red Emergency SOS Beacon Modal */}
      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        currentUser={currentUser}
      />

      {/* High-Tech Command Footer with FYP Milestone Telemetry */}
      <footer style={{
        margin: '10px 18px 14px 18px',
        padding: '12px 18px',
        background: 'rgba(11, 18, 36, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '11.5px',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '800', color: '#fbbf24', letterSpacing: '0.04em' }}>DAFFODILS</span>
          <span>•</span>
          <span>Real-Time Mobility, Logistics & Continuity Intelligence Platform</span>
          <span>•</span>
          <span style={{ color: '#06b6d4' }}>Daffodils Cognitive Core</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulsing-green-dot"></span>
            <span style={{ color: '#6ee7b7', fontWeight: '600' }}>
              Phase 1 & 2 Operational [68.4% Milestone Completed]
            </span>
          </div>
          <span style={{ color: '#475569' }}>|</span>
          <span className="mono" style={{ color: '#cbd5e1' }}>
            Telemetry Stream Ingestion: ONLINE
          </span>
        </div>
      </footer>

    </div>
  );
}

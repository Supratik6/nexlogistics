import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MapView from './components/MapView';
import MobilityTab from './components/MobilityTab';
import FreightTab from './components/FreightTab';
import PackersMoversTab from './components/PackersMoversTab';
import AmbulanceTab from './components/AmbulanceTab';
import AccessNexaSimulator from './components/AccessNexaSimulator';
import AIStudioTab from './components/AIStudioTab';
import VoiceModal from './components/VoiceModal';
import { storageService } from './services/storageService';
import { soundFx } from './services/soundService';

export default function App() {
  const [appState, setAppState] = useState(storageService.getState());
  const [activeTab, setActiveTab] = useState('map');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Subscribe to storage service updates (includes 2s simulated telemetry ticker)
  useEffect(() => {
    const unsubscribe = storageService.subscribe((newState) => {
      setAppState({ ...newState });
      // Keep selected vehicle data synced
      if (selectedVehicle) {
        const updated = newState.vehicles.find(v => v.id === selectedVehicle.id);
        if (updated) setSelectedVehicle(updated);
      }
    });
    return () => unsubscribe();
  }, [selectedVehicle]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'radial-gradient(ellipse at top, #0b1426 0%, #050811 100%)' }}>
      
      {/* Top Military/Command Header */}
      <Header
        system={appState.system}
        onReset={handleReset}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Primary Vertical Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vehicles={appState.vehicles}
        emergencyCount={appState.emergencyAlerts.length}
        disruptionCount={appState.disruptions.filter(d => d.active).length}
      />

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1 }}>
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

        {activeTab === 'accessnexa' && (
          <AccessNexaSimulator
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

      {/* Quick Voice Assistant Floating Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
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
          <span style={{ fontWeight: '700', color: '#f1f5f9' }}>VYONEX v1.4</span>
          <span>•</span>
          <span>Architected by <strong>Team NEXORA</strong> (B.Tech CSE Capstone Project)</span>
          <span>•</span>
          <span style={{ color: '#06b6d4' }}>ACCESSNEXA Intelligence Core</span>
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
            Local Storage Telematics Buffer: ONLINE
          </span>
        </div>
      </footer>

    </div>
  );
}

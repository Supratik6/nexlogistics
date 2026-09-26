import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation2, 
  Crosshair, 
  Layers, 
  AlertTriangle, 
  Siren, 
  Gauge, 
  BatteryCharging, 
  Compass, 
  Zap,
  MapPin,
  Maximize2
} from 'lucide-react';
import { soundFx } from '../services/soundService';

export default function MapView({ vehicles, disruptions, emergencyAlerts, onSelectVehicle, selectedVehicle }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const corridorLayerRef = useRef(null);
  const hazardLayerRef = useRef(null);
  const userGpsMarkerRef = useRef(null);

  const [filterType, setFilterType] = useState('ALL');
  const [userGpsActive, setUserGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around urban cluster (e.g. 22.5650, 88.3750)
      const map = L.map(mapContainerRef.current, {
        center: [22.5580, 88.3800],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // OpenStreetMap Free Global Tiles (Zero API Key required, 100% free for GitHub Pages)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc',
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Moving Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Filter vehicles
    const filtered = vehicles.filter(v => {
      if (filterType === 'ALL') return true;
      return v.type === filterType;
    });

    // Remove old markers not in list
    const activeIds = new Set(filtered.map(v => v.id));
    Object.keys(markersRef.current).forEach(id => {
      if (!activeIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    filtered.forEach(vehicle => {
      const isAmbulance = vehicle.type === 'AMBULANCE';
      const isMover = vehicle.type === 'MOVER';
      const isFreight = vehicle.type === 'FREIGHT';

      let markerColor = '#06b6d4'; // Default cab cyan
      if (isAmbulance) markerColor = '#ef4444';
      if (isMover) markerColor = '#a855f7';
      if (isFreight) markerColor = '#6366f1';

      // Custom high-tech SVG Marker HTML
      const iconHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          ${isAmbulance ? `
            <div style="position: absolute; top: -8px; width: 44px; height: 44px; border-radius: 50%; background: rgba(239, 68, 68, 0.35); border: 2px solid #ef4444; animation: siren-pulse 1.2s infinite;"></div>
          ` : ''}
          <div style="
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            background: #0f172a; 
            border: 2px solid ${markerColor}; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 0 14px ${markerColor};
            transform: rotate(${vehicle.heading || 0}deg);
            transition: all 0.5s linear;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${markerColor}" stroke="none">
              <polygon points="12 2 19 21 12 17 5 21 12 2" />
            </svg>
          </div>
          <div style="
            margin-top: 3px; 
            background: rgba(15, 23, 42, 0.9); 
            border: 1px solid ${markerColor}; 
            color: #ffffff; 
            font-size: 10px; 
            font-family: var(--font-mono); 
            font-weight: 700; 
            padding: 2px 6px; 
            border-radius: 4px; 
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.8);
          ">
            ${vehicle.id} (${vehicle.speedKmh} km/h)
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-vehicle-marker',
        iconSize: [40, 48],
        iconAnchor: [20, 24]
      });

      if (!markersRef.current[vehicle.id]) {
        const marker = L.marker([vehicle.currentLat, vehicle.currentLng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          onSelectVehicle(vehicle);
          soundFx.playRadarPing();
        });
        markersRef.current[vehicle.id] = marker;
      } else {
        markersRef.current[vehicle.id].setLatLng([vehicle.currentLat, vehicle.currentLng]);
        markersRef.current[vehicle.id].setIcon(customIcon);
      }
    });

  }, [vehicles, filterType, onSelectVehicle]);

  // Render Emergency Green Corridor and Disruptions
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing corridor layer
    if (corridorLayerRef.current) {
      corridorLayerRef.current.remove();
      corridorLayerRef.current = null;
    }

    // Draw Ambulance Green Corridor if active
    const activeAmbulance = vehicles.find(v => v.type === 'AMBULANCE' && v.greenCorridorPreempted);
    if (activeAmbulance && activeAmbulance.routeWaypoints?.length > 1) {
      const polyline = L.polyline(activeAmbulance.routeWaypoints, {
        color: '#ef4444',
        weight: 6,
        opacity: 0.9,
        dashArray: '10, 10',
        lineCap: 'round'
      }).addTo(map);

      // Add glowing neon underlay
      const glowPoly = L.polyline(activeAmbulance.routeWaypoints, {
        color: '#38bdf8',
        weight: 12,
        opacity: 0.35,
        lineCap: 'round'
      }).addTo(map);

      const group = L.featureGroup([glowPoly, polyline]);
      corridorLayerRef.current = group;
    }

    // Remove existing hazard layer
    if (hazardLayerRef.current) {
      hazardLayerRef.current.remove();
      hazardLayerRef.current = null;
    }

    // Draw Active Disruptions
    const activeDisruptions = disruptions.filter(d => d.active);
    if (activeDisruptions.length > 0) {
      const hazardElements = activeDisruptions.map(hazard => {
        const circle = L.circle([hazard.lat, hazard.lng], {
          radius: hazard.radiusMeters || 800,
          color: '#f59e0b',
          fillColor: '#ef4444',
          fillOpacity: 0.22,
          weight: 2,
          dashArray: '6, 6'
        });

        circle.bindPopup(`
          <div style="font-family: var(--font-heading); padding: 4px;">
            <div style="color: #f59e0b; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 6px;">
              <span>⚠️ ${hazard.title}</span>
            </div>
            <div style="font-size: 11.5px; color: #cbd5e1; margin-top: 4px;">
              ${hazard.impactSummary}
            </div>
            <div style="font-size: 11px; color: #38bdf8; margin-top: 4px; font-weight: 600;">
              Suggested: ${hazard.contingencyPlan}
            </div>
          </div>
        `);

        return circle;
      });

      const hazardGroup = L.featureGroup(hazardElements).addTo(map);
      hazardLayerRef.current = hazardGroup;
    }

  }, [vehicles, disruptions]);

  // Real Phone/Device GPS Tracking
  const handleTrackMyGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    soundFx.playRadarPing();
    setUserGpsActive(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const map = mapInstanceRef.current;
        if (!map) return;

        map.flyTo([latitude, longitude], 15, { duration: 1.5 });

        const gpsIcon = L.divIcon({
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(6, 182, 212, 0.4); animation: pulse-dot 1.8s infinite;"></div>
              <div style="width: 16px; height: 16px; border-radius: 50%; background: #06b6d4; border: 2px solid #ffffff; box-shadow: 0 0 12px #06b6d4;"></div>
            </div>
          `,
          className: 'user-gps-pin',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        if (userGpsMarkerRef.current) {
          userGpsMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          userGpsMarkerRef.current = L.marker([latitude, longitude], { icon: gpsIcon })
            .bindPopup(`<b style="color: #06b6d4;">Live User Telemetry Pin</b><br/>Accuracy: ±${Math.round(accuracy)}m`)
            .addTo(map);
        }
      },
      (err) => {
        setGpsError(`GPS Access: ${err.message || 'Permission denied'}`);
        setUserGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCenterAll = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([22.5580, 88.3800], 13, { duration: 1 });
    soundFx.playRadarPing();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 165px)', minHeight: '520px', borderRadius: '14px', overflow: 'hidden' }}>
      
      {/* Real Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Top Control Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {/* Layer Filters */}
        <div className="glass-panel" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={14} color="#94a3b8" />
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>FILTER:</span>
          {['ALL', 'CAB', 'FREIGHT', 'MOVER', 'AMBULANCE'].map(type => (
            <button
              key={type}
              onClick={() => { setFilterType(type); soundFx.playRadarPing(); }}
              style={{
                background: filterType === type ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                border: filterType === type ? '1px solid #06b6d4' : '1px solid transparent',
                color: filterType === type ? '#22d3ee' : '#cbd5e1',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Real Device GPS Trigger */}
        <button
          onClick={handleTrackMyGps}
          className="btn-primary"
          style={{ padding: '7px 14px', fontSize: '12px', borderRadius: '8px' }}
          title="Connect browser/phone GPS sensor directly into Daffodils"
        >
          <Crosshair size={14} />
          <span>{userGpsActive ? 'My GPS Active' : 'My Real GPS Pin'}</span>
        </button>

        {/* Reset Center */}
        <button
          onClick={handleCenterAll}
          className="btn-ghost"
          style={{ padding: '7px 12px', fontSize: '12px', borderRadius: '8px' }}
        >
          <Maximize2 size={13} />
          <span>Reset Frame</span>
        </button>

        {gpsError && (
          <span className="badge-status badge-amber" style={{ fontSize: '11px' }}>
            {gpsError}
          </span>
        )}
      </div>

      {/* Floating Map Legend & Telemetry Ticker (Bottom-Left) */}
      <div className="glass-panel" style={{
        position: 'absolute',
        bottom: '20px',
        left: '16px',
        zIndex: 1000,
        padding: '10px 14px',
        maxWidth: '360px',
        fontSize: '11.5px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: '700', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation2 size={13} color="#06b6d4" />
            ACTIVE TELEMATICS FEED
          </span>
          <span className="badge-status badge-emerald" style={{ fontSize: '10px' }}>
            LIVE 2.0s SYNC
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span>
            <span>Mobility Cabs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}></span>
            <span>Freight (Reefer)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span>
            <span>Packers & Movers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
            <span>Lifeline Ambulance</span>
          </div>
        </div>
      </div>

      {/* Selected Vehicle Telematics HUD (Bottom-Right) */}
      {selectedVehicle && (
        <div className="glass-panel" style={{
          position: 'absolute',
          bottom: '20px',
          right: '16px',
          zIndex: 1000,
          padding: '16px 20px',
          width: '340px',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#06b6d4', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {selectedVehicle.type} TELEMETRY HUD
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                {selectedVehicle.id}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                {selectedVehicle.subType}
              </div>
            </div>
            <button 
              onClick={() => onSelectVehicle(null)} 
              className="btn-ghost" 
              style={{ padding: '2px 8px', fontSize: '11px' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', fontSize: '12px' }}>
            <div className="glass-card" style={{ padding: '8px 12px' }}>
              <div style={{ color: '#64748b', fontSize: '10px' }}>SPEED / HEADING</div>
              <div style={{ fontWeight: '700', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gauge size={13} color="#06b6d4" />
                <span className="mono">{selectedVehicle.speedKmh} km/h ({selectedVehicle.heading}°)</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '8px 12px' }}>
              <div style={{ color: '#64748b', fontSize: '10px' }}>POWER / HEALTH</div>
              <div style={{ fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BatteryCharging size={13} color="#10b981" />
                <span className="mono">{selectedVehicle.batteryOrFuel}%</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '10px', fontSize: '12px', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '11px' }}>
              <MapPin size={12} color="#06b6d4" />
              <span>Destination: <strong style={{ color: '#fff' }}>{selectedVehicle.destinationName}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '11px' }}>
              <Zap size={12} color="#f59e0b" />
              <span>Projected ETA: <strong style={{ color: '#f59e0b' }}>{selectedVehicle.etaMinutes} mins</strong></span>
            </div>
          </div>

          {selectedVehicle.temperatureC && (
            <div style={{ marginTop: '8px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '6px', padding: '6px 10px', fontSize: '11.5px', color: '#c7d2fe' }}>
              ❄️ Reefer Temp: <strong>{selectedVehicle.temperatureC}°C</strong> (Target: {selectedVehicle.targetTempC}°C)
            </div>
          )}

          {selectedVehicle.priorityCode && (
            <div style={{ marginTop: '8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '6px', padding: '6px 10px', fontSize: '11.5px', color: '#fca5a5' }}>
              🚨 Emergency Priority: <strong>{selectedVehicle.priorityCode}</strong> (Corridor Active)
            </div>
          )}
        </div>
      )}

    </div>
  );
}

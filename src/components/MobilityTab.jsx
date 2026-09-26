import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, 
  MapPin, 
  Navigation, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Clock, 
  User, 
  Star,
  ArrowRight
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function MobilityTab({ vehicles, onBookRide, onSelectVehicle }) {
  const [pickup, setPickup] = useState('Howrah Station VIP Taxi Bay');
  const [destination, setDestination] = useState('Salt Lake Sector V IT Park');
  const [selectedTier, setSelectedTier] = useState('EV_SEDAN');
  const [isMatching, setIsMatching] = useState(false);
  const [matchedBooking, setMatchedBooking] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const rideTiers = [
    {
      id: 'EV_SEDAN',
      name: 'Executive Eco EV Sedan',
      eta: '4 mins away',
      baseFare: 280,
      perKm: 18,
      rating: 4.9,
      badge: 'Zero Emission'
    },
    {
      id: 'SUV_PRIME',
      name: 'Comfort SUV Prime',
      eta: '7 mins away',
      baseFare: 420,
      perKm: 24,
      rating: 4.85,
      badge: 'Spacious 6-Seater'
    },
    {
      id: 'MICRO_TRANSIT',
      name: 'Smart Micro-Transit Express',
      eta: '2 mins away',
      baseFare: 160,
      perKm: 12,
      rating: 4.75,
      badge: 'Fastest ETA'
    }
  ];

  const activeTier = rideTiers.find(t => t.id === selectedTier) || rideTiers[0];
  const estimatedDistKm = 14.2;
  const estimatedTotalFare = Math.round(activeTier.baseFare + (estimatedDistKm * activeTier.perKm));

  const handleRequestRide = (e) => {
    e.preventDefault();
    setIsMatching(true);
    soundFx.playRadarPing();

    setTimeout(() => {
      const result = onBookRide({
        pickup,
        destination,
        rideType: activeTier,
        fare: estimatedTotalFare
      });

      setIsMatching(false);
      setMatchedBooking({
        bookingId: result.bookingId,
        driverName: result.vehicle.driverName,
        plate: result.vehicle.plate,
        vehicleName: result.vehicle.subType,
        otp: Math.floor(1000 + Math.random() * 9000),
        fare: estimatedTotalFare,
        vehicle: result.vehicle
      });
    }, 2000);
  };

  const activeCabs = vehicles.filter(v => v.type === 'CAB');

  return (
    <div style={{ padding: '0 18px 24px 18px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-status badge-cyan">
              MOBILITY PILLAR 1
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Daffodils Dynamic Spatial Matching & Telematics
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
            On-Demand Urban Mobility & Dynamic Dispatch
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="glass-card" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={16} color="#06b6d4" />
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Active Fleet Cabs: <strong style={{ color: '#fff' }}>{activeCabs.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Booking & Dispatch Columns */}
      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(320px, 1fr)', gap: '18px' }}>
        
        {/* Left: Ride Request Form */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={18} color="#06b6d4" />
            <span>Instant Mobility Dispatch Console</span>
          </h3>

          <form onSubmit={handleRequestRide}>
            {/* Pickup & Destination */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Pickup Location</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <MapPin size={16} color="#10b981" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Dropoff Destination</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <MapPin size={16} color="#ef4444" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>
            </div>

            {/* Ride Tier Selection */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                Select Vehicle Tier:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rideTiers.map(tier => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => { setSelectedTier(tier.id); soundFx.playRadarPing(); }}
                      className="glass-card"
                      style={{
                        padding: '12px 14px',
                        cursor: 'pointer',
                        border: isSelected ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Car size={18} color={isSelected ? '#22d3ee' : '#94a3b8'} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                            {tier.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {tier.eta} • <span style={{ color: '#38bdf8' }}>{tier.badge}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#34d399' }}>
                          ₹ {Math.round(tier.baseFare + (estimatedDistKm * tier.perKm))}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                          Incl. tolls & taxes
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Button */}
            <button
              type="submit"
              disabled={isMatching}
              className="btn-primary"
              style={{ width: '100%', padding: '12px 18px', fontSize: '14px' }}
            >
              {isMatching ? (
                <>
                  <span className="pulsing-green-dot"></span>
                  <span>Daffodils Spatial Sonar Matching...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Request Instant Mobility Dispatch (₹ {estimatedTotalFare})</span>
                </>
              )}
            </button>
          </form>

          {/* Matched Driver Confirmation Card */}
          {matchedBooking && (
            <div className="glass-panel" style={{ marginTop: '16px', padding: '16px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge-status badge-emerald" style={{ fontSize: '10px' }}>
                    DRIVER DISPATCHED & EN ROUTE
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', marginTop: '6px' }}>
                    {matchedBooking.driverName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {matchedBooking.vehicleName} • <strong style={{ color: '#38bdf8' }}>{matchedBooking.plate}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'center', background: 'rgba(15, 23, 42, 0.8)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>START TRIP OTP</div>
                  <div className="mono" style={{ fontSize: '16px', fontWeight: '800', color: '#22d3ee' }}>
                    {matchedBooking.otp}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  Trip ID: <span className="mono" style={{ color: '#06b6d4' }}>{matchedBooking.bookingId}</span>
                </span>
                <button
                  onClick={() => onSelectVehicle(matchedBooking.vehicle)}
                  className="btn-ghost"
                  style={{ fontSize: '11px', padding: '4px 10px', color: '#22d3ee' }}
                >
                  Track on GIS Map
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right: Active Mobility Missions Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div className="glass-panel" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={16} color="#06b6d4" />
              <span>Active Urban Mobility Units</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeCabs.map(cab => (
                <div key={cab.id} className="glass-card" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono" style={{ fontSize: '13px', fontWeight: '800', color: '#22d3ee' }}>
                          {cab.id}
                        </span>
                        <span className="badge-status badge-emerald" style={{ fontSize: '9.5px' }}>
                          {cab.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#f8fafc', marginTop: '2px', fontWeight: '600' }}>
                        {cab.driverName} ({cab.plate})
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Heading: {cab.destinationName}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>
                        {cab.speedKmh} km/h
                      </div>
                      <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                        ETA: {cab.etaMinutes} mins
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Battery/Health: <strong style={{ color: '#10b981' }}>{cab.batteryOrFuel}%</strong>
                    </span>
                    <button
                      onClick={() => onSelectVehicle(cab)}
                      className="btn-ghost"
                      style={{ fontSize: '10.5px', padding: '3px 8px' }}
                    >
                      Focus Telemetry
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

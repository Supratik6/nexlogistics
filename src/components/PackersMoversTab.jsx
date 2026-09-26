import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Box, 
  Truck, 
  ShieldCheck, 
  Users, 
  Calculator, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  QrCode, 
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle,
  FileText
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function PackersMoversTab({ orders, onCreateOrder, onSelectVehicle, vehicles, onOpenInvoice }) {
  const [apartmentType, setApartmentType] = useState('2 BHK');
  const [packingTier, setPackingTier] = useState('Premium 3-Layer Foam & Bubble-Shield');
  const [customerName, setCustomerName] = useState('Dr. Arindam Roy');
  const [phone, setPhone] = useState('+91 98310 98765');
  const [pickupAddress, setPickupAddress] = useState('Flat 4B, Silver Oak, Gariahat Road');
  const [deliveryAddress, setDeliveryAddress] = useState('Tower 12, Rosedale Garden, New Town');
  const [insuranceValue, setInsuranceValue] = useState(750000);

  const containerRef = useRef(null);
  const volumeDisplayRef = useRef(null);

  // Selected item counters
  const [items, setItems] = useState({
    sofa: { name: '3-Seater Sofa Suite', count: 1, volumeEach: 75, fragile: false },
    bed: { name: 'Queen/King Bed & Mattress', count: 2, volumeEach: 65, fragile: false },
    dining: { name: 'Glass Top Dining Table + 6 Chairs', count: 1, volumeEach: 40, fragile: true },
    fridge: { name: 'Double-Door Refrigerator', count: 1, volumeEach: 45, fragile: true },
    tv: { name: '55" Smart OLED Television', count: 1, volumeEach: 20, fragile: true },
    wardrobeBoxes: { name: 'Standard Wardrobe Boxes (Clothes/Linen)', count: 8, volumeEach: 12, fragile: false },
    crockeryBoxes: { name: 'Fragile Kitchen & Glassware Crates', count: 4, volumeEach: 10, fragile: true },
    washingMachine: { name: 'Front-Load Washing Machine', count: 1, volumeEach: 30, fragile: true }
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Calculate totals
  const totalVolume = Object.values(items).reduce((acc, item) => acc + (item.count * item.volumeEach), 0);
  const totalWeight = Math.round(totalVolume * 2.4);

  // GSAP Smooth Volume Counter Pop
  useEffect(() => {
    if (volumeDisplayRef.current) {
      gsap.fromTo(volumeDisplayRef.current,
        { scale: 1.15, color: '#fbbf24' },
        { scale: 1, color: '#c084fc', duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [totalVolume]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  // Recommend truck
  let recommendedTruck = 'Tata Ace (7ft Open/Closed)';
  let requiredCrew = '2 Packing Technicians';
  let baseFreight = 4500;

  if (totalVolume > 650) {
    recommendedTruck = '19ft Heavy Closed Container Truck';
    requiredCrew = '1 Supervisor + 4 Certified Technicians';
    baseFreight = 12500;
  } else if (totalVolume > 350) {
    recommendedTruck = '14ft Eicher High-Capacity Van';
    requiredCrew = '1 Supervisor + 3 Certified Technicians';
    baseFreight = 8200;
  }

  const tierCostMultiplier = packingTier.includes('Wooden') ? 1.4 : packingTier.includes('Premium') ? 1.2 : 1.0;
  const packingCost = Math.round(totalVolume * 4.5 * tierCostMultiplier);
  const insurancePremium = Math.round(insuranceValue * 0.0035);
  const totalEstimate = baseFreight + packingCost + insurancePremium;

  const handleItemCountChange = (key, delta) => {
    setItems(prev => {
      const current = prev[key].count;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [key]: { ...prev[key], count: next }
      };
    });
    soundFx.playRadarPing();
  };

  const handleBookMove = (e) => {
    e.preventDefault();
    const selectedItemsList = Object.entries(items)
      .filter(([_, v]) => v.count > 0)
      .map(([_, v]) => ({ name: v.name, qty: v.count, fragile: v.fragile, volume: v.volumeEach * v.count }));

    onCreateOrder({
      customerName,
      phone,
      apartmentType,
      pickupAddress,
      deliveryAddress,
      volumeCuFt: totalVolume,
      packingTier,
      insuranceValue,
      totalCost: totalEstimate,
      selectedItems: selectedItemsList
    });

    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  return (
    <div style={{ padding: '0 18px 24px 18px' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-status badge-purple">
              LOGISTICS PILLAR 3
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Daffodils Volumetric & Chain-of-Custody Engine
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
            Packers & Movers Relocation Operations
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onOpenInvoice && onOpenInvoice({
              type: 'MOVERS',
              invoiceNumber: 'DAF-TAX-MOV-8842',
              customerName: customerName || 'Dr. Arindam Roy',
              customerPhone: phone || '+91 98310 98765',
              pickup: pickupAddress,
              dropoff: deliveryAddress,
              vehicleModel: 'Daffodils Heavy Move-Hauler (DAF-MOV-02)',
              volumetricWeightKg: 380,
              baseFare: 8400,
              totalFare: 9912,
              otp: '8842'
            })}
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: '12px', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
          >
            <FileText size={14} />
            <span>Digital Manifest / Invoice</span>
          </button>
          <div className="glass-card" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={16} color="#a855f7" />
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Active Relocations: <strong style={{ color: '#fff' }}>{orders?.length || 1}</strong>
            </span>
          </div>
        </div>
      </div>

      {bookingSuccess && (
        <div className="glass-panel" style={{
          marginBottom: '16px',
          padding: '12px 18px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CheckCircle2 size={20} color="#10b981" />
          <div>
            <div style={{ fontWeight: '700', color: '#34d399' }}>Relocation Order Successfully Scheduled!</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Manifest generated, crew allocated, and relocation van #DAF-MOV-303 is tracked live on the GIS matrix.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Volumetric Estimator & Live Order Pipeline */}
      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(320px, 1fr)', gap: '18px' }}>
        
        {/* Left Column: Volumetric Inventory Engine & Quote Configurator */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calculator size={18} color="#a855f7" />
            <h3 style={{ fontSize: '16px', color: '#ffffff' }}>Volumetric Inventory & Transport Estimator</h3>
          </div>

          <form onSubmit={handleBookMove}>
            {/* Apartment Size Select */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Premise / Move Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {['1 BHK', '2 BHK', '3 BHK', 'Villa / Tech Office'].map(type => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => { setApartmentType(type); soundFx.playRadarPing(); }}
                    style={{
                      background: apartmentType === type ? 'rgba(168, 85, 247, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      border: apartmentType === type ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: apartmentType === type ? '#c084fc' : '#cbd5e1',
                      padding: '8px 4px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Item Counter List */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Select Core Household & Fragile Inventory:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                {Object.entries(items).map(([key, item]) => (
                  <div key={key} className="glass-card" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#f1f5f9' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {item.volumeEach} Cu.Ft each {item.fragile && <span style={{ color: '#f59e0b' }}>• Fragile (Glass/Electronics)</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleItemCountChange(key, -1)}
                        className="btn-ghost"
                        style={{ padding: '2px 8px', fontSize: '14px', borderRadius: '4px' }}
                      >
                        -
                      </button>
                      <span className="mono" style={{ fontSize: '13px', fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>
                        {item.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleItemCountChange(key, 1)}
                        className="btn-ghost"
                        style={{ padding: '2px 8px', fontSize: '14px', borderRadius: '4px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-Time Mathematical Output Card with GSAP Pop */}
            <div className="glass-card" style={{ padding: '14px', marginBottom: '16px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>TOTAL VOLUME</div>
                  <div ref={volumeDisplayRef} style={{ fontSize: '16px', fontWeight: '800', color: '#c084fc' }}>
                    {totalVolume} <span style={{ fontSize: '11px' }}>Cu.Ft</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>EST. WEIGHT</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#f1f5f9' }}>
                    {totalWeight} <span style={{ fontSize: '11px' }}>kg</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>ESTIMATED FARE</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#34d399' }}>
                    ₹ {totalEstimate.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11.5px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                <span>🚛 Vehicle: <strong>{recommendedTruck}</strong></span>
                <span>👷 Crew: <strong>{requiredCrew}</strong></span>
              </div>
            </div>

            {/* Address & Booking Form Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Pickup Address</label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="glass-input"
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="glass-input"
                  style={{ marginTop: '4px' }}
                />
              </div>
            </div>

            {/* Packaging Tier Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Packing Material Tier
              </label>
              <select
                value={packingTier}
                onChange={(e) => setPackingTier(e.target.value)}
                className="glass-input"
                style={{ background: '#0b1224' }}
              >
                <option value="Standard Eco-Corrugated Pack">Standard Eco-Corrugated Pack</option>
                <option value="Premium 3-Layer Foam & Bubble-Shield">Premium 3-Layer Foam & Bubble-Shield</option>
                <option value="Ultra-Safe Wooden Crating (Zero Fragile Breakage)">Ultra-Safe Wooden Crating (Zero Fragile Breakage)</option>
              </select>
            </div>

            {/* Book Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                boxShadow: '0 4px 18px rgba(168, 85, 247, 0.4)'
              }}
            >
              <Package size={16} />
              <span>Confirm & Dispatch Relocation Mission</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Relocation Orders & Chain of Custody Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {orders?.map(order => (
            <div key={order.orderId} className="glass-panel" style={{ padding: '18px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '14px', fontWeight: '800', color: '#c084fc' }}>
                      {order.orderId}
                    </span>
                    <span className="badge-status badge-purple" style={{ fontSize: '10px' }}>
                      IN TRANSIT
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>
                    {order.customerName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {order.moveType} • {order.totalVolumeCuFt} Cu.Ft ({order.estimatedWeightKg} kg)
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>TOTAL QUOTE</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#34d399' }}>
                    ₹ {order.totalCost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', fontSize: '11.5px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                  <MapPin size={12} color="#06b6d4" />
                  <span>From: {order.pickupAddress}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', marginTop: '4px' }}>
                  <ArrowRight size={12} color="#a855f7" />
                  <span>To: {order.deliveryAddress}</span>
                </div>
              </div>

              {/* 6-Stage Visual Chain of Custody Pipeline */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  6-Stage Chain-of-Custody Verification:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {order.stages.map((stage, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {stage.done ? (
                          <CheckCircle2 size={14} color="#10b981" />
                        ) : (
                          <Clock size={14} color="#64748b" />
                        )}
                        <span style={{ color: stage.done ? '#f1f5f9' : '#64748b', fontWeight: stage.done ? '600' : '400' }}>
                          {stage.label}
                        </span>
                      </div>
                      <span className="mono" style={{ fontSize: '10.5px', color: stage.done ? '#10b981' : '#64748b' }}>
                        {stage.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crew & Telematics Link */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={13} color="#a855f7" />
                  <span>{order.crewAssigned}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => onOpenInvoice && onOpenInvoice({
                      type: 'MOVERS',
                      invoiceNumber: `DAF-TAX-${order.orderId}`,
                      customerName: order.customerName,
                      customerPhone: '+91 98310 98765',
                      pickup: order.pickupAddress,
                      dropoff: order.deliveryAddress,
                      vehicleModel: `Daffodils Move-Hauler (${order.assignedVehicle})`,
                      volumetricWeightKg: order.estimatedWeightKg,
                      baseFare: Math.round(order.totalCost / 1.18),
                      totalFare: order.totalCost,
                      otp: '7291'
                    })}
                    className="btn-ghost"
                    style={{ fontSize: '11px', padding: '4px 10px', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                  >
                    <FileText size={12} />
                    <span>View Manifest</span>
                  </button>
                  <button
                    onClick={() => {
                      const moverVehicle = vehicles.find(v => v.id === order.assignedVehicle);
                      if (moverVehicle) onSelectVehicle(moverVehicle);
                    }}
                    className="btn-ghost"
                    style={{ fontSize: '11px', padding: '4px 10px', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
                  >
                    <Truck size={12} />
                    <span>Track Van {order.assignedVehicle}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

// Daffodils Unified Data & Telematics Service (Continuity Intelligence Platform)
import { soundFx } from './soundService';

const STORAGE_KEY = 'daffodils_command_state_v2';

// Initial High-Fidelity Dataset
const INITIAL_DATA = {
  system: {
    status: 'OPERATIONAL',
    phase: 'PHASE 1 & 2 ACTIVE [68.4% MILESTONE]',
    version: 'Daffodils Engine v2.0-PROD',
    telemetryRateMs: 2000,
    activeMissionsCount: 6,
    avgNetworkLatencyMs: 24,
    lastSyncTimestamp: new Date().toISOString()
  },
  // Fleet & Mobility Units
  vehicles: [
    {
      id: 'DAF-CAB-101',
      type: 'CAB',
      subType: 'Executive EV Sedan',
      driverName: 'Vikramaditya Sen',
      plate: 'WB-02-AX-8910',
      batteryOrFuel: 88,
      status: 'IN_TRANSIT',
      currentLat: 22.5726,
      currentLng: 88.3639,
      heading: 45,
      speedKmh: 42,
      missionId: 'MIS-MOB-401',
      destinationName: 'Salt Lake Sector V Tech Hub',
      etaMinutes: 14,
      routeWaypoints: [
        [22.5726, 88.3639],
        [22.5760, 88.3750],
        [22.5800, 88.4100],
        [22.5868, 88.4178]
      ],
      currentStep: 0
    },
    {
      id: 'DAF-FRT-502',
      type: 'FREIGHT',
      subType: 'Cold-Chain Pharma Reefer (14ft)',
      driverName: 'Harminder Singh',
      plate: 'WB-19-JK-4421',
      batteryOrFuel: 74,
      status: 'IN_TRANSIT',
      currentLat: 22.5350,
      currentLng: 88.3420,
      heading: 120,
      speedKmh: 36,
      missionId: 'MIS-FRT-904',
      destinationName: 'Apollo Med-Logistics Warehouse',
      etaMinutes: 28,
      temperatureC: -19.4,
      targetTempC: -20.0,
      cargoType: 'Vaccines & Biologics (Critical)',
      sealTamperRisk: 'SECURE',
      routeWaypoints: [
        [22.5350, 88.3420],
        [22.5400, 88.3550],
        [22.5520, 88.3800],
        [22.5690, 88.4020]
      ],
      currentStep: 0
    },
    {
      id: 'DAF-MOV-303',
      type: 'MOVER',
      subType: 'Heavy Relocation Van (19ft Eicher)',
      driverName: 'Prabhat Mukherjee',
      plate: 'WB-06-TT-7712',
      batteryOrFuel: 65,
      status: 'IN_TRANSIT',
      currentLat: 22.5100,
      currentLng: 88.3700,
      heading: 210,
      speedKmh: 28,
      missionId: 'MIS-MOV-202',
      destinationName: 'New Town Eco-Greens Tower C',
      etaMinutes: 38,
      inventoryVolumeCuFt: 620,
      cargoCategory: '2 BHK Household Luxury Goods',
      routeWaypoints: [
        [22.5100, 88.3700],
        [22.5250, 88.3850],
        [22.5600, 88.4300],
        [22.5920, 88.4750]
      ],
      currentStep: 0
    },
    {
      id: 'DAF-AMB-911',
      type: 'AMBULANCE',
      subType: 'Type-C Advanced Life Support (ALS)',
      driverName: 'Somenath Roy (EMT: Dr. K. Bose)',
      plate: 'WB-01-EM-0911',
      batteryOrFuel: 94,
      status: 'EMERGENCY_CORRIDOR_ACTIVE',
      currentLat: 22.5480,
      currentLng: 88.3500,
      heading: 80,
      speedKmh: 68,
      missionId: 'MIS-EMR-001',
      destinationName: 'Apex Trauma & Cardiac Emergency Bay',
      etaMinutes: 7,
      priorityCode: 'CODE_RED',
      patientVitals: {
        heartRateBpm: 122,
        spo2Percent: 93,
        bpSystolic: 135,
        bpDiastolic: 88,
        triageCondition: 'Acute Coronary Syndrome'
      },
      greenCorridorPreempted: true,
      routeWaypoints: [
        [22.5480, 88.3500],
        [22.5510, 88.3620],
        [22.5590, 88.3840],
        [22.5670, 88.3990]
      ],
      currentStep: 0
    },
    {
      id: 'DAF-CAB-104',
      type: 'CAB',
      subType: 'Smart Micro-Transit Eco',
      driverName: 'Arjun Das',
      plate: 'WB-04-QQ-1188',
      batteryOrFuel: 82,
      status: 'AVAILABLE',
      currentLat: 22.5850,
      currentLng: 88.4200,
      heading: 0,
      speedKmh: 0,
      missionId: null,
      destinationName: 'Standby at Park Circus Crossing',
      etaMinutes: 0,
      routeWaypoints: [],
      currentStep: 0
    }
  ],

  // Packers and Movers Live Orders
  packersMoversOrders: [
    {
      orderId: 'PM-2026-881',
      customerName: 'Ananya & Sourav Banerjee',
      phone: '+91 98301 22345',
      moveType: '2 BHK Household Relocation',
      pickupAddress: 'Block B, South City Residency, Prince Anwar Shah Rd',
      deliveryAddress: 'Tower 4, Uniworld City, New Town Action Area III',
      totalVolumeCuFt: 580,
      estimatedWeightKg: 1450,
      assignedVehicle: 'DAF-MOV-303',
      crewAssigned: 'Crew Alpha (Lead: Subhashis, 3 Specialists)',
      packingTier: 'Premium 3-Layer Foam & Bubble-Shield',
      insuranceValue: '₹ 8,50,000',
      totalCost: 14800,
      currentStage: 3,
      stages: [
        { label: 'Inventory Audited & Approved', done: true, time: '08:30 AM' },
        { label: 'Relocation Crew & Truck Dispatched', done: true, time: '09:15 AM' },
        { label: 'Fragile Box Tagging & Bubble Curing', done: true, time: '11:45 AM' },
        { label: 'Secure Transit & Telematics Active', done: true, time: '01:20 PM' },
        { label: 'Destination Unloading & Staging', done: false, time: 'Estimated 02:45 PM' },
        { label: 'Room-by-Room Inspection & Handover', done: false, time: 'Pending' }
      ],
      itemsList: [
        { name: 'King Size Teakwood Bed', qty: 1, fragile: false, volume: 80 },
        { name: '65-inch OLED TV & Soundbar', qty: 1, fragile: true, volume: 25 },
        { name: 'Double Door Inverter Refrigerator', qty: 1, fragile: true, volume: 45 },
        { name: '3-Seater L-Shape Leather Sofa', qty: 1, fragile: false, volume: 90 },
        { name: 'Kitchen Cutlery & Crockery Crates', qty: 6, fragile: true, volume: 60 },
        { name: 'Wardrobe Garments & Linen Boxes', qty: 8, fragile: false, volume: 110 }
      ]
    }
  ],

  // Lifeline Ambulance Emergency Queue
  emergencyAlerts: [
    {
      incidentId: 'EMR-INC-09',
      triageCode: 'CODE_RED',
      severity: 'CRITICAL',
      patientName: 'Subir Karmakar, 58M',
      conditionSummary: 'Acute Chest Pain, ST-Elevation Suspicion',
      pickupLocation: 'Bhowanipore Metro Gate 2',
      destinationHospital: 'Apex Cardiac & Trauma Care (Emergency Bay 3)',
      ambulanceId: 'DAF-AMB-911',
      distanceRemainingKm: 3.8,
      etaMins: 7,
      greenCorridorActive: true,
      preemptedSignals: ['Exide Crossing (Green 45s)', 'Mullick Bazar (Green 60s)', 'Park Circus Flyover Ramp (Cleared)'],
      vitalsHistory: [
        { time: '14:10', hr: 112, spo2: 95, bp: '130/85' },
        { time: '14:12', hr: 118, spo2: 94, bp: '132/86' },
        { time: '14:14', hr: 122, spo2: 93, bp: '135/88' }
      ]
    }
  ],

  // Daffodils Active Disruption Graph
  disruptions: [
    {
      id: 'DIS-001',
      title: 'Waterlogging & Inundation Hazard',
      locationName: 'Maa Flyover Western Ramp Junction',
      lat: 22.5450,
      lng: 88.3750,
      radiusMeters: 800,
      severity: 'HIGH_ALERT',
      type: 'WEATHER_FLOOD',
      impactSummary: 'Average speed dropped to 8 km/h. High potential for vehicle stall.',
      affectedMissions: ['MIS-MOB-401', 'MIS-FRT-904'],
      contingencyPlan: 'Reroute via AJC Bose Road Lower Ramp. Reroute delta: +3.2 mins vs +26 mins delay.',
      active: true
    }
  ],

  // Audit Logs
  auditLogs: [
    { timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(), event: 'DAFFODILS: Telematics stream initialized for Sector 1-5' },
    { timestamp: new Date(Date.now() - 2400000).toLocaleTimeString(), event: 'LIFELINE: Emergency Code Red dispatched to DAF-AMB-911' },
    { timestamp: new Date(Date.now() - 1200000).toLocaleTimeString(), event: 'DISRUPTION: Anomaly detected at Maa Flyover Ramp, impact evaluated' },
    { timestamp: new Date(Date.now() - 300000).toLocaleTimeString(), event: 'MOVERS: Staging verification completed for Order #PM-2026-881' }
  ]
};

class StorageService {
  constructor() {
    this.data = this.loadState();
    this.subscribers = new Set();
    this.startSimulationTicker();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    this.saveState(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveState(newData) {
    this.data = newData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {}
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => cb(this.data));
  }

  getState() {
    return this.data;
  }

  resetToDefault() {
    this.saveState(JSON.parse(JSON.stringify(INITIAL_DATA)));
    soundFx.playSuccessChime();
  }

  // Real-time Vehicle Coordinate Simulation Loop
  startSimulationTicker() {
    setInterval(() => {
      const nextVehicles = this.data.vehicles.map(v => {
        if (v.status !== 'IN_TRANSIT' && v.status !== 'EMERGENCY_CORRIDOR_ACTIVE') {
          return v;
        }

        const pts = v.routeWaypoints;
        if (!pts || pts.length < 2) return v;

        const currentStep = v.currentStep || 0;
        const nextStep = (currentStep + 1) % pts.length;
        const targetPt = pts[nextStep];

        // Smoothly interpolate towards target point
        const latDelta = (targetPt[0] - v.currentLat) * 0.15;
        const lngDelta = (targetPt[1] - v.currentLng) * 0.15;

        let newLat = v.currentLat + latDelta;
        let newLng = v.currentLng + lngDelta;

        const dist = Math.sqrt(Math.pow(targetPt[0] - newLat, 2) + Math.pow(targetPt[1] - newLng, 2));
        let updatedStep = currentStep;
        if (dist < 0.001) {
          updatedStep = nextStep;
        }

        const speedNoise = (Math.random() - 0.5) * 4;
        const nextSpeed = Math.max(15, Math.min(85, Math.round(v.speedKmh + speedNoise)));

        return {
          ...v,
          currentLat: Number(newLat.toFixed(6)),
          currentLng: Number(newLng.toFixed(6)),
          speedKmh: nextSpeed,
          currentStep: updatedStep
        };
      });

      this.data.vehicles = nextVehicles;
      this.data.system.lastSyncTimestamp = new Date().toISOString();
      this.saveState(this.data);
    }, 2000);
  }

  // Create on-demand ride booking
  createRideBooking({ pickup, destination, rideType, fare }) {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVehicle = {
      id: `DAF-CAB-${Math.floor(200 + Math.random() * 800)}`,
      type: 'CAB',
      subType: rideType.name,
      driverName: 'Rameshwar Mahato',
      plate: `WB-02-B-${Math.floor(1000 + Math.random() * 9000)}`,
      batteryOrFuel: 85,
      status: 'IN_TRANSIT',
      currentLat: 22.5650,
      currentLng: 88.3580,
      heading: 90,
      speedKmh: 38,
      missionId: bookingId,
      destinationName: destination,
      etaMinutes: 12,
      routeWaypoints: [
        [22.5650, 88.3580],
        [22.5690, 88.3700],
        [22.5780, 88.3900],
        [22.5850, 88.4100]
      ],
      currentStep: 0
    };

    const nextVehicles = [newVehicle, ...this.data.vehicles];
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      event: `MOBILITY: New booking ${bookingId} matched to ${newVehicle.plate} (${rideType.name})`
    };

    this.data.vehicles = nextVehicles;
    this.data.auditLogs = [log, ...this.data.auditLogs];
    this.data.system.activeMissionsCount += 1;
    this.saveState(this.data);

    soundFx.playSuccessChime();
    return { bookingId, vehicle: newVehicle };
  }

  // Create Packers and Movers Booking
  createPackersMoversOrder(orderData) {
    const orderId = `PM-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      orderId,
      customerName: orderData.customerName || 'Valued Relocation Client',
      phone: orderData.phone || '+91 98000 00000',
      moveType: orderData.apartmentType || '2 BHK Relocation',
      pickupAddress: orderData.pickupAddress || 'City Center Block A',
      deliveryAddress: orderData.deliveryAddress || 'Highland Park Tower 2',
      totalVolumeCuFt: orderData.volumeCuFt || 480,
      estimatedWeightKg: Math.round((orderData.volumeCuFt || 480) * 2.5),
      assignedVehicle: 'DAF-MOV-303',
      crewAssigned: 'Crew Beta (Lead: Ashish Roy, 3 Pros)',
      packingTier: orderData.packingTier || 'Premium 3-Layer Shield',
      insuranceValue: `₹ ${Number(orderData.insuranceValue || 500000).toLocaleString('en-IN')}`,
      totalCost: orderData.totalCost || 12500,
      currentStage: 1,
      stages: [
        { label: 'Inventory Audited & Approved', done: true, time: new Date().toLocaleTimeString() },
        { label: 'Relocation Crew Assigned', done: true, time: 'Allocated' },
        { label: 'Fragile Box Tagging & Curing', done: false, time: 'Scheduled' },
        { label: 'Secure Transit & Telematics Active', done: false, time: 'Pending' },
        { label: 'Destination Unloading & Staging', done: false, time: 'Pending' },
        { label: 'Room-by-Room Inspection & Handover', done: false, time: 'Pending' }
      ],
      itemsList: orderData.selectedItems || []
    };

    this.data.packersMoversOrders = [newOrder, ...this.data.packersMoversOrders];
    this.data.auditLogs = [
      { timestamp: new Date().toLocaleTimeString(), event: `PACKERS & MOVERS: New order ${orderId} created (${newOrder.totalVolumeCuFt} Cu.Ft)` },
      ...this.data.auditLogs
    ];
    this.saveState(this.data);

    soundFx.playSuccessChime();
    return newOrder;
  }

  // Dispatch Lifeline Emergency Ambulance
  dispatchAmbulance(ambulanceRequest) {
    const alertId = `EMR-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert = {
      incidentId: alertId,
      triageCode: ambulanceRequest.triageCode || 'CODE_RED',
      severity: ambulanceRequest.triageCode === 'CODE_RED' ? 'CRITICAL' : 'URGENT',
      patientName: ambulanceRequest.patientName || 'Emergency Patient',
      conditionSummary: ambulanceRequest.condition || 'Severe Trauma / Respiratory Distress',
      pickupLocation: ambulanceRequest.pickupLocation || 'Park Street Crossing',
      destinationHospital: ambulanceRequest.destinationHospital || 'Apex Medical Trauma Bay',
      ambulanceId: 'DAF-AMB-911',
      distanceRemainingKm: 4.2,
      etaMins: 6,
      greenCorridorActive: true,
      preemptedSignals: ['Crossing 1 (Preempted GREEN)', 'Central Arterial (Cleared)', 'Hospital Approach (Siren Alerted)'],
      vitalsHistory: [
        { time: new Date().toLocaleTimeString(), hr: 125, spo2: 92, bp: '140/90' }
      ]
    };

    this.data.vehicles = this.data.vehicles.map(v => {
      if (v.id === 'DAF-AMB-911') {
        return {
          ...v,
          status: 'EMERGENCY_CORRIDOR_ACTIVE',
          speedKmh: 75,
          greenCorridorPreempted: true,
          etaMinutes: 6
        };
      }
      return v;
    });

    this.data.emergencyAlerts = [newAlert, ...this.data.emergencyAlerts];
    this.data.auditLogs = [
      { timestamp: new Date().toLocaleTimeString(), event: `LIFELINE: Emergency ${alertId} (${ambulanceRequest.triageCode}) Green Corridor PREEMPTED` },
      ...this.data.auditLogs
    ];
    this.saveState(this.data);

    soundFx.playEmergencySirenBurst();
    return newAlert;
  }

  // Inject or Toggle Disruption in Daffodils
  toggleDisruption(disruptionId) {
    this.data.disruptions = this.data.disruptions.map(d => {
      if (d.id === disruptionId) {
        const nextState = !d.active;
        return { ...d, active: nextState };
      }
      return d;
    });

    const target = this.data.disruptions.find(d => d.id === disruptionId);
    this.data.auditLogs = [
      { timestamp: new Date().toLocaleTimeString(), event: `DAFFODILS: Disruption ${target?.title} status changed to ${target?.active ? 'ACTIVE' : 'RESOLVED'}` },
      ...this.data.auditLogs
    ];
    this.saveState(this.data);
    soundFx.playAlertPing();
  }

  // Trigger Autonomous Reroute for a Vehicle
  executeAutonomousReroute(vehicleId) {
    this.data.vehicles = this.data.vehicles.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          etaMinutes: Math.max(5, v.etaMinutes - 8),
          destinationName: `${v.destinationName} (Rerouted via Bypass)`,
          routeWaypoints: [
            [v.currentLat, v.currentLng],
            [v.currentLat + 0.015, v.currentLng - 0.015],
            [v.currentLat + 0.03, v.currentLng + 0.02],
            [22.5868, 88.4178]
          ],
          currentStep: 0
        };
      }
      return v;
    });

    this.data.auditLogs = [
      { timestamp: new Date().toLocaleTimeString(), event: `DAFFODILS: Autonomous reroute executed for ${vehicleId}. Projected ETA recovered by 8 mins.` },
      ...this.data.auditLogs
    ];
    this.saveState(this.data);
    soundFx.playSuccessChime();
  }
}

export const storageService = new StorageService();

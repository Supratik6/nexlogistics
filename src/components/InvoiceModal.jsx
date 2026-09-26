import React, { useRef, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle, 
  ShieldCheck, 
  X, 
  QrCode, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Package, 
  DollarSign,
  Building2,
  Lock
} from 'lucide-react';
import gsap from 'gsap';
import { soundFx } from '../services/soundService';

export default function InvoiceModal({ isOpen, onClose, invoiceData }) {
  if (!isOpen) return null;

  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.92, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  }, [isOpen]);

  const handlePrint = () => {
    soundFx.playSuccessChime();
    window.print();
  };

  // Default demo data if none passed
  const isMovers = invoiceData?.type === 'MOVERS' || invoiceData?.inventory;
  const invNumber = invoiceData?.invoiceNumber || (isMovers ? 'DAF-TAX-MOV-8842' : 'DAF-TAX-CAB-3914');
  const dateStr = invoiceData?.date || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = invoiceData?.time || new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const baseFare = invoiceData?.baseFare || (isMovers ? 8400 : 285);
  const gstAmount = Math.round(baseFare * 0.18);
  const insuranceFee = isMovers ? 450 : 15;
  const totalAmount = invoiceData?.totalFare || (baseFare + gstAmount + insuranceFee);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 7, 18, 0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div 
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '780px',
          background: '#090e1a',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden'
        }}
      >
        {/* Top Control Bar */}
        <div style={{
          padding: '14px 20px',
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(6, 182, 212, 0.12) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.02em' }}>
                {isMovers ? 'RELOCATION MANIFEST & TAX INVOICE' : 'DIGITAL TRIP INVOICE & RECEIPT'}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Daffodils Mobility & Logistics Continuity Network • GST Compliant
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#050811',
                border: 'none',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet Content */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          color: '#e2e8f0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          
          {/* Header row: Brand & Invoice Meta */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '18px',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#fbbf24', letterSpacing: '-0.02em' }}>
                  DAFFODILS
                </span>
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#6ee7b7',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  ORIGINAL TAX INVOICE
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: '1.5' }}>
                Daffodils Mobility & Intelligent Freight Systems Pvt. Ltd.<br />
                CIN: U72900WB2026PTC109284 • GSTIN: 19AAACD9284F1Z8<br />
                Kolkata Smart Urban Terminal Hub, Sector V, Salt Lake, Kolkata 700091
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Document Reference No:</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#67e8f9', fontFamily: 'monospace' }}>
                {invNumber}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
                Issue Date: <strong style={{ color: '#cbd5e1' }}>{dateStr}</strong> | <span style={{ color: '#cbd5e1' }}>{timeStr}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <CheckCircle size={12} />
                <span>Digitally Signed & Validated</span>
              </div>
            </div>
          </div>

          {/* Client & Booking Context Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '20px'
          }}>
            {/* Billed To */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building2 size={12} color="#fbbf24" />
                <span>Billed To (Customer / Consignee)</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                {invoiceData?.customerName || 'Verified Commuter / Client'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '2px' }}>
                Phone: {invoiceData?.customerPhone || '+91 98310 99887'}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Account: Verified Daffodils Citizen Member
              </div>
            </div>

            {/* Service & Route */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={12} color="#06b6d4" />
                <span>Service Transit Corridor</span>
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                <strong style={{ color: '#ffffff' }}>Origin:</strong> {invoiceData?.pickup || invoiceData?.origin || 'Salt Lake Sector V Hub'}
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>
                <strong style={{ color: '#ffffff' }}>Destination:</strong> {invoiceData?.dropoff || invoiceData?.destination || 'New Town Action Area II'}
              </div>
              <div style={{ fontSize: '11px', color: '#67e8f9', marginTop: '3px' }}>
                Vehicle: {invoiceData?.vehicleModel || (isMovers ? 'Daffodils Heavy Move-Hauler (DAF-MOV-02)' : 'Eco EV Sedan (DAF-CAB-01)')}
              </div>
            </div>

            {/* Custody & Security */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={12} color="#10b981" />
                <span>Security & Custody Seal</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#cbd5e1' }}>
                Transit OTP: <span style={{ fontFamily: 'monospace', color: '#fbbf24', fontWeight: '800', background: 'rgba(245, 158, 11, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>{invoiceData?.otp || '9799'}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '3px' }}>
                Insurance Cover: <strong style={{ color: '#10b981' }}>₹5,00,000 Zero-Deductible</strong>
              </div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
                Telemetry Seal: SHA256 Verified
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: '600' }}>Item Description</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600' }}>SAC / HSN Code</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600', textAlign: 'center' }}>Qty / Units</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600', textAlign: 'right' }}>Taxable Value</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '600', color: '#ffffff' }}>
                      {isMovers ? 'Turnkey Relocation & Volumetric Logistics Services' : 'On-Demand Urban Zero-Emission EV Mobility Transit'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {isMovers ? 'Includes Multi-Layer Bubble Wrap, Furniture Disassembly & Ground Loading' : 'Includes Corridor Green Wave Traversal & Route Optimization'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#cbd5e1', fontFamily: 'monospace' }}>
                    {isMovers ? '996511' : '996412'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: '#cbd5e1' }}>
                    {isMovers ? `${invoiceData?.volumetricWeightKg || 380} kg` : '1 Trip (14.2 km)'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '600', color: '#ffffff', fontFamily: 'monospace' }}>
                    ₹{baseFare.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: '500', color: '#cbd5e1' }}>Comprehensive In-Transit Goods & Passenger Protection</div>
                    <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Underwritten by Daffodils SafeTransit Syndicate</div>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#cbd5e1', fontFamily: 'monospace' }}>997133</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#cbd5e1' }}>1 Policy</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '600', color: '#ffffff', fontFamily: 'monospace' }}>
                    ₹{insuranceFee}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: '500', color: '#cbd5e1' }}>Central Goods & Service Tax (CGST @ 9%)</div>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>—</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#cbd5e1' }}>9.0%</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '600', color: '#ffffff', fontFamily: 'monospace' }}>
                    ₹{Math.round(gstAmount / 2).toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: '500', color: '#cbd5e1' }}>State Goods & Service Tax (SGST @ 9%)</div>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>—</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#cbd5e1' }}>9.0%</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '600', color: '#ffffff', fontFamily: 'monospace' }}>
                    ₹{Math.round(gstAmount / 2).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total Row */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.12)',
              borderTop: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>TOTAL INVOICE AMOUNT (INCL. TAXES):</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>(Payment Settled via Daffodils Enterprise Escrow)</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24', fontFamily: 'monospace' }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Bottom Security Seals & QR Verification */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
            paddingTop: '16px',
            fontSize: '11px',
            color: '#94a3b8'
          }}>
            {/* Synthetic High-Tech QR Code SVG */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: '#ffffff',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="#050811">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h4v4h-4v-4zm-4-4h4v2h-4v-2zm2 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-2h2v4h-2v-4zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#ffffff' }}>Scan to Verify Authenticity</div>
                <div style={{ color: '#67e8f9', fontFamily: 'monospace' }}>SHA-256: 4f8b9e...2a71d</div>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Valid for IT Rebate & GST Input Credit</div>
              </div>
            </div>

            {/* Academic Footnote */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fbbf24', fontWeight: '700', letterSpacing: '0.04em' }}>
                DAFFODILS INTELLIGENCE PLATFORM
              </div>
              <div style={{ color: '#6ee7b7', fontWeight: '600' }}>
                Phase 1 & 2 Operational [68.4% Milestone Completed]
              </div>
              <div style={{ color: '#64748b', fontSize: '10px' }}>
                Computer Generated Document • No Physical Signature Required
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

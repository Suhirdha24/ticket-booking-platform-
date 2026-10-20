import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  QrCode,
  AlertCircle,
  HelpCircle,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Button from '../common/Button.jsx';

export default function PaymentForm({ total = 0, onSubmit, isProcessing = false }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NET_BANKING'
  const [upiSubMode, setUpiSubMode] = useState('QR'); // 'QR' | 'ID'
  const [upiProvider, setUpiProvider] = useState('GPAY');
  const [upiId, setUpiId] = useState('');

  // Card form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState('VISA');

  // Net banking state
  const [bankName, setBankName] = useState('HDFC Bank');
  const [bankSearch, setBankSearch] = useState('');

  // Dynamic QR Code Canvas
  const qrCanvasRef = useRef(null);

  // Auto-detect card brand
  useEffect(() => {
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (/^4/.test(cleanNum)) {
      setCardBrand('VISA');
    } else if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(cleanNum)) {
      setCardBrand('MASTERCARD');
    } else if (/^(60|65|81|82)/.test(cleanNum)) {
      setCardBrand('RUPAY');
    } else if (/^3[47]/.test(cleanNum)) {
      setCardBrand('AMEX');
    } else {
      setCardBrand('GENERIC');
    }
  }, [cardNumber]);

  // Generate dynamic QR code for UPI
  useEffect(() => {
    if (paymentMethod === 'UPI' && upiSubMode === 'QR' && qrCanvasRef.current) {
      const upiUrl = `upi://pay?pa=eventhub@okaxis&pn=EventHub%20Tickets&am=${total.toFixed(2)}&cu=INR&tn=TicketReservation`;
      QRCode.toCanvas(
        qrCanvasRef.current,
        upiUrl,
        {
          width: 170,
          margin: 1,
          color: {
            dark: '#08070D',
            light: '#FFFFFF',
          },
        },
        (err) => {
          if (err) console.error('Failed to generate UPI QR', err);
        }
      );
    }
  }, [paymentMethod, upiSubMode, total]);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = val.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : val);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  // Quick preset for UPI provider
  const handleProviderSelect = (provider, sampleVpa) => {
    setUpiProvider(provider);
    if (!upiId || upiId.includes('@')) {
      const username = upiId ? upiId.split('@')[0] : 'user';
      const suffix =
        provider === 'GPAY'
          ? '@okhdfcbank'
          : provider === 'PAYTM'
          ? '@paytm'
          : provider === 'PHONEPE'
          ? '@ybl'
          : '@upi';
      setUpiId(`${username}${suffix}`);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    let formattedUpi = (upiId || '').trim();
    if (paymentMethod === 'UPI') {
      if (upiSubMode === 'QR') {
        formattedUpi = `qr-scan-${Date.now()}@upi`;
      } else if (!formattedUpi) {
        formattedUpi = 'verified@upi';
      } else if (/^\d{10}$/.test(formattedUpi)) {
        const suffix =
          upiProvider === 'GPAY'
            ? '@okhdfcbank'
            : upiProvider === 'PAYTM'
            ? '@paytm'
            : upiProvider === 'PHONEPE'
            ? '@ybl'
            : '@upi';
        formattedUpi = `${formattedUpi}${suffix}`;
      }
    }

    const paymentDetails =
      paymentMethod === 'UPI'
        ? {
            upiId: formattedUpi,
            provider: upiSubMode === 'QR' ? 'UPI_DYNAMIC_QR' : upiProvider,
          }
        : paymentMethod === 'CARD'
        ? {
            cardNumber: cardNumber || '4242 4242 4242 4242',
            cardHolder: cardHolder || 'Authorized Cardholder',
            cardExpiry: cardExpiry || '12/28',
            cardCvv: cardCvv || '888',
            cardBrand,
          }
        : {
            bankCode: bankName.toUpperCase().replace(/\s+/g, '_'),
            bankName: bankName || 'Online Banking',
          };

    onSubmit({
      paymentMethod,
      paymentDetails,
      simulateFailure: false,
    });
  };

  const POPULAR_BANKS = [
    { name: 'HDFC Bank', code: 'HDFC' },
    { name: 'State Bank of India', code: 'SBI' },
    { name: 'ICICI Bank', code: 'ICICI' },
    { name: 'Axis Bank', code: 'AXIS' },
    { name: 'Kotak Mahindra', code: 'KOTAK' },
    { name: 'Bank of Baroda', code: 'BOB' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-widget-card"
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.6rem',
        backgroundColor: 'rgba(20, 18, 34, 0.88)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(139, 92, 246, 0.15)',
      }}
    >
      {/* Header with SSL Security Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Payment Gateway
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.15rem' }}>
            Select Payment Method
          </h3>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#10B981',
            fontSize: '0.75rem',
            fontWeight: 800,
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          <ShieldCheck size={15} />
          <span>256-Bit SSL Secured</span>
        </div>
      </div>

      {/* Primary Payment Mode Navigation Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
        }}
      >
        {/* UPI Option */}
        <button
          type="button"
          onClick={() => setPaymentMethod('UPI')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '1.1rem 0.75rem',
            borderRadius: '16px',
            background:
              paymentMethod === 'UPI'
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.15) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
            border:
              paymentMethod === 'UPI'
                ? '1.5px solid #8B5CF6'
                : '1px solid rgba(255, 255, 255, 0.08)',
            color: paymentMethod === 'UPI' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: paymentMethod === 'UPI' ? '0 0 25px rgba(139, 92, 246, 0.4)' : 'none',
          }}
        >
          <Smartphone size={22} color={paymentMethod === 'UPI' ? '#A78BFA' : '#64748B'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>UPI & QR</span>
        </button>

        {/* Card Option */}
        <button
          type="button"
          onClick={() => setPaymentMethod('CARD')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '1.1rem 0.75rem',
            borderRadius: '16px',
            background:
              paymentMethod === 'CARD'
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.15) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
            border:
              paymentMethod === 'CARD'
                ? '1.5px solid #8B5CF6'
                : '1px solid rgba(255, 255, 255, 0.08)',
            color: paymentMethod === 'CARD' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: paymentMethod === 'CARD' ? '0 0 25px rgba(139, 92, 246, 0.4)' : 'none',
          }}
        >
          <CreditCard size={22} color={paymentMethod === 'CARD' ? '#A78BFA' : '#64748B'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Cards</span>
        </button>

        {/* Net Banking Option */}
        <button
          type="button"
          onClick={() => setPaymentMethod('NET_BANKING')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '1.1rem 0.75rem',
            borderRadius: '16px',
            background:
              paymentMethod === 'NET_BANKING'
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.15) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
            border:
              paymentMethod === 'NET_BANKING'
                ? '1.5px solid #8B5CF6'
                : '1px solid rgba(255, 255, 255, 0.08)',
            color: paymentMethod === 'NET_BANKING' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: paymentMethod === 'NET_BANKING' ? '0 0 25px rgba(139, 92, 246, 0.4)' : 'none',
          }}
        >
          <Building size={22} color={paymentMethod === 'NET_BANKING' ? '#A78BFA' : '#64748B'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Net Banking</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 📱 1. UPI METHOD: SUB-TABS (DYNAMIC QR vs UPI ID) */}
      {/* ========================================================================= */}
      {paymentMethod === 'UPI' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Sub-selector for QR vs ID */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.3rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => setUpiSubMode('QR')}
              style={{
                flex: 1,
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: upiSubMode === 'QR' ? 'var(--gradient-purple)' : 'transparent',
                color: upiSubMode === 'QR' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease',
                boxShadow: upiSubMode === 'QR' ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
              }}
            >
              <QrCode size={15} />
              <span>Scan Dynamic QR</span>
            </button>
            <button
              type="button"
              onClick={() => setUpiSubMode('ID')}
              style={{
                flex: 1,
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: upiSubMode === 'ID' ? 'var(--gradient-purple)' : 'transparent',
                color: upiSubMode === 'ID' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease',
                boxShadow: upiSubMode === 'ID' ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
              }}
            >
              <Smartphone size={15} />
              <span>Enter UPI ID / VPA</span>
            </button>
          </div>

          {/* Mode A: Scan QR Code */}
          {upiSubMode === 'QR' && (
            <div className="upi-qr-container">
              <div className="upi-qr-box">
                <canvas ref={qrCanvasRef} />
                <div className="laser-scan-line" />
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
                  Scan to pay ₹{total.toFixed(2)}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                  Open Google Pay, PhonePe, Paytm, or BHIM and scan this code
                </p>
              </div>

              {/* Supported UPI Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#A78BFA', fontWeight: 800, background: 'rgba(139, 92, 246, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>GPay</span>
                <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, background: 'rgba(56, 189, 248, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>PhonePe</span>
                <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>Paytm</span>
                <span style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>BHIM UPI</span>
              </div>
            </div>
          )}

          {/* Mode B: Enter UPI ID */}
          {upiSubMode === 'ID' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.6rem' }}>
                  Choose Fast App Preset
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => handleProviderSelect('GPAY', 'user@okhdfcbank')}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      background: upiProvider === 'GPAY' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: upiProvider === 'GPAY' ? '1.5px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    Google Pay
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderSelect('PAYTM', 'user@paytm')}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      background: upiProvider === 'PAYTM' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: upiProvider === 'PAYTM' ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    Paytm
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderSelect('PHONEPE', 'user@ybl')}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '12px',
                      background: upiProvider === 'PHONEPE' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: upiProvider === 'PHONEPE' ? '1.5px solid #C084FC' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    PhonePe
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
                  Virtual Payment Address (UPI ID)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 9876543210@paytm or yourname@okhdfcbank"
                    required={paymentMethod === 'UPI' && upiSubMode === 'ID'}
                  />
                  {upiId.includes('@') && (
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }}>
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '0.82rem',
                  color: '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <ShieldCheck size={18} />
                <span>Instant payment collect request will be sent to your UPI app.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💳 2. CREDIT / DEBIT CARD WITH LIVE VIRTUAL CARD PREVIEW */}
      {/* ========================================================================= */}
      {paymentMethod === 'CARD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Virtual Card Interactive Hologram Preview */}
          <div className="virtual-card-preview">
            <div className="virtual-card-shine" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="virtual-chip" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 900, fontSize: '0.92rem', color: '#A78BFA' }}>
                <Sparkles size={14} color="#A78BFA" />
                <span>{cardBrand}</span>
              </div>
            </div>

            <div className="card-number-display">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: '#A5B4FC', fontWeight: 700, letterSpacing: '0.08em' }}>
                  Cardholder
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cardHolder || 'Your Name'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', color: '#A5B4FC', fontWeight: 700, letterSpacing: '0.08em' }}>
                  Expires
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {cardExpiry || 'MM/YY'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Cardholder Name
            </label>
            <input
              type="text"
              className="form-input"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="e.g. John Doe"
              required={paymentMethod === 'CARD'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Card Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4532 8900 1234 5678"
                maxLength={19}
                required={paymentMethod === 'CARD'}
              />
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#A78BFA', background: 'rgba(139, 92, 246, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {cardBrand}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
                Expiry Date
              </label>
              <input
                type="text"
                className="form-input"
                value={cardExpiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                required={paymentMethod === 'CARD'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
                CVV / CVC
              </label>
              <input
                type="password"
                className="form-input"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                placeholder="e.g. 888"
                required={paymentMethod === 'CARD'}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏛️ 3. NET BANKING WITH POPULAR QUICK SELECT PILLS */}
      {/* ========================================================================= */}
      {paymentMethod === 'NET_BANKING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
              Select Popular Bank
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              {POPULAR_BANKS.map((b) => {
                const isSelected = bankName === b.name;
                return (
                  <button
                    key={b.code}
                    type="button"
                    onClick={() => setBankName(b.name)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '14px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.15) 100%)'
                        : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1.5px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.35)' : 'none',
                    }}
                  >
                    <span>{b.name}</span>
                    {isSelected && <Check size={16} color="#A78BFA" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Or Type Other Bank Name
            </label>
            <input
              type="text"
              className="form-input"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. Punjab National Bank, Canara Bank..."
              required={paymentMethod === 'NET_BANKING'}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 SUBMIT CTA WITH DYNAMIC PROCESSING STATE */}
      {/* ========================================================================= */}
      <button
        type="submit"
        disabled={isProcessing}
        className="btn-purple-glow shimmer-btn"
        style={{
          width: '100%',
          padding: '1.15rem',
          fontSize: '1.05rem',
          fontWeight: 900,
          marginTop: '0.75rem',
          borderRadius: '16px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: isProcessing ? 0.8 : 1,
        }}
      >
        {isProcessing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: '#FFFFFF',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>Authorizing Payment & Confirming Tickets...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Lock size={18} />
            <span>Pay ₹{total.toFixed(2)} & Confirm Tickets</span>
          </div>
        )}
      </button>

      {/* Trust & Guarantee Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          fontSize: '0.75rem',
          color: '#94A3B8',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>PCI-DSS Certified</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={14} color="#A78BFA" />
          <span>Instant QR Delivery</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Lock size={14} color="#38BDF8" />
          <span>100% Secure Checkout</span>
        </div>
      </div>
    </form>
  );
}

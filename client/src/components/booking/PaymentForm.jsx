import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function PaymentForm({ total, onSubmit, isProcessing }) {
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [upiProvider, setUpiProvider] = useState('GPAY');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankName, setBankName] = useState('');

  const handleProviderSelect = (provider, sampleVpa) => {
    setUpiProvider(provider);
    if (!upiId) {
      setUpiId(sampleVpa);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formattedUpi = (upiId || '').trim();
    if (!formattedUpi) {
      formattedUpi = 'user@upi';
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

    const paymentDetails =
      paymentMethod === 'UPI'
        ? { upiId: formattedUpi, provider: upiProvider }
        : paymentMethod === 'CARD'
        ? {
            cardNumber: cardNumber || '4242 4242 4242 4242',
            cardHolder: cardHolder || 'Cardholder Name',
            cardExpiry: cardExpiry || '12/28',
            cardCvv: cardCvv || '888',
          }
        : { bankCode: bankName || 'GENERAL_BANK', bankName: bankName || 'Online Banking' };

    onSubmit({
      paymentMethod,
      paymentDetails,
      simulateFailure: false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-widget-card"
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.6rem',
        backgroundColor: 'rgba(20, 18, 34, 0.85)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(139, 92, 246, 0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
          Select Payment Method
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontSize: '0.78rem', fontWeight: 700 }}>
          <ShieldCheck size={16} />
          <span>SSL Secured</span>
        </div>
      </div>

      {/* Payment Method Selector Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
        }}
      >
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
                ? 'rgba(139, 92, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.03)',
            border:
              paymentMethod === 'UPI'
                ? '1.5px solid #8B5CF6'
                : '1px solid rgba(255, 255, 255, 0.08)',
            color: paymentMethod === 'UPI' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: paymentMethod === 'UPI' ? '0 0 20px rgba(139, 92, 246, 0.35)' : 'none',
          }}
        >
          <Smartphone size={22} color={paymentMethod === 'UPI' ? '#A78BFA' : '#64748B'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>UPI / Apps</span>
        </button>

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
                ? 'rgba(139, 92, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.03)',
            border:
              paymentMethod === 'CARD'
                ? '1.5px solid #8B5CF6'
                : '1px solid rgba(255, 255, 255, 0.08)',
            color: paymentMethod === 'CARD' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: paymentMethod === 'CARD' ? '0 0 20px rgba(139, 92, 246, 0.35)' : 'none',
          }}
        >
          <CreditCard size={22} color={paymentMethod === 'CARD' ? '#A78BFA' : '#64748B'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Credit / Debit</span>
        </button>

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
                ? 'rgba(139, 92, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.03)',
            border:
              paymentMethod === 'NET_BANKING'
                ? '1.5px solid #8B5CF6'
                : '1px solid rgba(255, 255, 255, 0.08)',
            color: paymentMethod === 'NET_BANKING' ? '#FFFFFF' : '#94A3B8',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: paymentMethod === 'NET_BANKING' ? '0 0 20px rgba(139, 92, 246, 0.35)' : 'none',
          }}
        >
          <Building size={22} color={paymentMethod === 'NET_BANKING' ? '#A78BFA' : '#64748B'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Net Banking</span>
        </button>
      </div>

      {/* UPI / GPay / Paytm Options */}
      {paymentMethod === 'UPI' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.6rem' }}>
              Choose UPI Provider
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
                🔵 Google Pay
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
                🔷 Paytm
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
                🟣 PhonePe
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Virtual Payment Address (UPI ID)
            </label>
            <input
              type="text"
              className="form-input"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. 9876543210@paytm or yourname@okaxis"
              required
            />
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
            <span>Instant approval via {upiProvider === 'GPAY' ? 'Google Pay' : upiProvider === 'PAYTM' ? 'Paytm' : 'PhonePe'}</span>
          </div>
        </div>
      )}

      {/* CARD Inputs */}
      {paymentMethod === 'CARD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Card Number
            </label>
            <input
              type="text"
              className="form-input"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="e.g. 4532 8900 1234 5678"
              maxLength={19}
              required
            />
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
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                required
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
                onChange={(e) => setCardCvv(e.target.value)}
                maxLength={4}
                placeholder="e.g. 888"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* NET BANKING Inputs */}
      {paymentMethod === 'NET_BANKING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Select or Type Bank Name
            </label>
            <input
              type="text"
              className="form-input"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. State Bank of India, HDFC Bank, ICICI Bank..."
              required
            />
          </div>

          {/* Quick Bank Chips */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.08em' }}>
              Popular Banks:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Bank of Baroda'].map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => setBankName(bank)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    background: bankName === bank ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.04)',
                    border: bankName === bank ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="btn-purple-glow"
        style={{
          width: '100%',
          padding: '1.1rem',
          fontSize: '1.05rem',
          fontWeight: 900,
          marginTop: '0.75rem',
          borderRadius: '16px',
        }}
      >
        <Lock size={18} />
        <span>Pay ₹{total.toFixed(2)} & Confirm Tickets</span>
      </button>
    </form>
  );
}

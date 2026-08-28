import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function PaymentForm({ total, onSubmit, isProcessing }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
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
      className="glass-panel"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
        Select Payment Method
      </h3>

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
            gap: '0.5rem',
            padding: '1rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background:
              paymentMethod === 'UPI'
                ? 'rgba(234, 179, 8, 0.15)'
                : 'var(--bg-surface)',
            border:
              paymentMethod === 'UPI'
                ? '1.5px solid #eab308'
                : '1px solid var(--border-subtle)',
            color: paymentMethod === 'UPI' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Smartphone size={22} color={paymentMethod === 'UPI' ? '#eab308' : 'var(--text-subtle)'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>UPI / Apps</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('CARD')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background:
              paymentMethod === 'CARD'
                ? 'rgba(234, 179, 8, 0.15)'
                : 'var(--bg-surface)',
            border:
              paymentMethod === 'CARD'
                ? '1.5px solid #eab308'
                : '1px solid var(--border-subtle)',
            color: paymentMethod === 'CARD' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <CreditCard size={22} color={paymentMethod === 'CARD' ? '#eab308' : 'var(--text-subtle)'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Card</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('NET_BANKING')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background:
              paymentMethod === 'NET_BANKING'
                ? 'rgba(234, 179, 8, 0.15)'
                : 'var(--bg-surface)',
            border:
              paymentMethod === 'NET_BANKING'
                ? '1.5px solid #eab308'
                : '1px solid var(--border-subtle)',
            color: paymentMethod === 'NET_BANKING' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Building size={22} color={paymentMethod === 'NET_BANKING' ? '#eab308' : 'var(--text-subtle)'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Net Banking</span>
        </button>
      </div>

      {/* UPI / GPay / Paytm Options */}
      {paymentMethod === 'UPI' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
          <div>
            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Choose UPI App
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleProviderSelect('GPAY', 'yourname@okhdfcbank')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: upiProvider === 'GPAY' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: upiProvider === 'GPAY' ? '1.5px solid #eab308' : '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                🔵 Google Pay
              </button>

              <button
                type="button"
                onClick={() => handleProviderSelect('PAYTM', 'yourname@paytm')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: upiProvider === 'PAYTM' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: upiProvider === 'PAYTM' ? '1.5px solid #22d3ee' : '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                🔷 Paytm
              </button>

              <button
                type="button"
                onClick={() => handleProviderSelect('PHONEPE', 'yourname@ybl')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: upiProvider === 'PHONEPE' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: upiProvider === 'PHONEPE' ? '1.5px solid #c084fc' : '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                🟣 PhonePe
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Virtual Payment Address (VPA / UPI ID)</label>
            <input
              type="text"
              className="input-field"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. 9876543210@paytm or user@okaxis"
              required
            />
          </div>

          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.82rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ShieldCheck size={16} /> Instant verification via {upiProvider === 'GPAY' ? 'Google Pay' : upiProvider === 'PAYTM' ? 'Paytm' : 'PhonePe'}
          </div>
        </div>
      )}

      {/* CARD Inputs */}
      {paymentMethod === 'CARD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Cardholder Name</label>
            <input
              type="text"
              className="input-field"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Card Number</label>
            <input
              type="text"
              className="input-field"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="e.g. 4532 8900 1234 5678"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Expiry Date</label>
              <input
                type="text"
                className="input-field"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">CVV / CVC</label>
              <input
                type="password"
                className="input-field"
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Select or Type Bank Name</label>
            <input
              type="text"
              className="input-field"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. State Bank of India, HDFC Bank, ICICI, Chase, Bank of America..."
              required
            />
          </div>

          {/* Quick Bank Chips */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.4rem' }}>
              Popular Banks:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Chase', 'Bank of America'].map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => setBankName(bank)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: bankName === bank ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: bankName === bank ? '1px solid #eab308' : '1px solid var(--border-subtle)',
                    color: bankName === bank ? '#eab308' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
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
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isProcessing}
        style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
      >
        <span>Pay ₹{total.toFixed(2)} & Confirm Tickets</span>
      </Button>
    </form>
  );
}

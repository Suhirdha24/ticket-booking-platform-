import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function PaymentForm({ total, onSubmit, isProcessing }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiProvider, setUpiProvider] = useState('GPAY');
  const [upiId, setUpiId] = useState('suhirdha@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState('Jane Doe');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [bankCode, setBankCode] = useState('CHASE');
  const [simulateFailure, setSimulateFailure] = useState(false);

  const handleProviderSelect = (provider, defaultVpa) => {
    setUpiProvider(provider);
    setUpiId(defaultVpa);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentDetails =
      paymentMethod === 'UPI'
        ? { upiId, provider: upiProvider }
        : paymentMethod === 'CARD'
        ? { cardNumber, cardHolder, cardExpiry, cardCvv }
        : { bankCode };

    onSubmit({
      paymentMethod,
      paymentDetails,
      simulateFailure,
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
                ? 'rgba(99, 102, 241, 0.2)'
                : 'var(--bg-surface)',
            border:
              paymentMethod === 'UPI'
                ? '1.5px solid var(--primary)'
                : '1px solid var(--border-subtle)',
            color: paymentMethod === 'UPI' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Smartphone size={22} color={paymentMethod === 'UPI' ? '#818cf8' : 'var(--text-subtle)'} />
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
                ? 'rgba(99, 102, 241, 0.2)'
                : 'var(--bg-surface)',
            border:
              paymentMethod === 'CARD'
                ? '1.5px solid var(--primary)'
                : '1px solid var(--border-subtle)',
            color: paymentMethod === 'CARD' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <CreditCard size={22} color={paymentMethod === 'CARD' ? '#818cf8' : 'var(--text-subtle)'} />
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
                ? 'rgba(99, 102, 241, 0.2)'
                : 'var(--bg-surface)',
            border:
              paymentMethod === 'NET_BANKING'
                ? '1.5px solid var(--primary)'
                : '1px solid var(--border-subtle)',
            color: paymentMethod === 'NET_BANKING' ? '#ffffff' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Building size={22} color={paymentMethod === 'NET_BANKING' ? '#818cf8' : 'var(--text-subtle)'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Net Banking</span>
        </button>
      </div>

      {/* UPI / GPay / Paytm Options */}
      {paymentMethod === 'UPI' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
          {/* Fast App Selection Badges */}
          <div>
            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Choose UPI App
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleProviderSelect('GPAY', 'user@okhdfcbank')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: upiProvider === 'GPAY' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: upiProvider === 'GPAY' ? '1.5px solid #818cf8' : '1px solid var(--border-subtle)',
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
                onClick={() => handleProviderSelect('PAYTM', 'user@paytm')}
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
                onClick={() => handleProviderSelect('PHONEPE', 'user@ybl')}
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
              placeholder="Full Name as on Card"
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
              placeholder="XXXX XXXX XXXX XXXX"
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
                placeholder="XXX"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* UPI Inputs */}
      {paymentMethod === 'UPI' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">UPI Virtual Payment Address (VPA)</label>
            <input
              type="text"
              className="input-field"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yourname@okhdfcbank"
              required
            />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            A mock payment approval notification will be automatically processed.
          </p>
        </div>
      )}

      {/* NET BANKING Inputs */}
      {paymentMethod === 'NET_BANKING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
          <div className="input-group">
            <label className="input-label">Select Bank</label>
            <select
              className="input-field"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="CHASE" style={{ backgroundColor: '#181a28' }}>JPMorgan Chase</option>
              <option value="BOA" style={{ backgroundColor: '#181a28' }}>Bank of America</option>
              <option value="WELLS" style={{ backgroundColor: '#181a28' }}>Wells Fargo</option>
              <option value="CITI" style={{ backgroundColor: '#181a28' }}>Citibank</option>
            </select>
          </div>
        </div>
      )}

      {/* Test / Evaluation Simulator Option */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <input
          type="checkbox"
          id="simulateFail"
          checked={simulateFailure}
          onChange={(e) => setSimulateFailure(e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
        <label htmlFor="simulateFail" style={{ fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <strong style={{ color: '#fb7185' }}>Test Mode:</strong> Simulate payment failure / bank decline
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isProcessing}
        style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
      >
        <span>Pay ${total.toFixed(2)} & Confirm Tickets</span>
      </Button>
    </form>
  );
}

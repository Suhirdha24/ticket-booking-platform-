import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Calendar, MapPin, Ticket, Download, Printer, CheckCircle2, QrCode, Sparkles, ShieldCheck } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function TicketCard({ booking, isNew = false }) {
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    if (isNew) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#8B5CF6', '#6366F1', '#38BDF8', '#10B981', '#F43F5E'],
      });
    }
  }, [isNew]);

  useEffect(() => {
    if (qrCanvasRef.current && booking?.qrToken) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        booking.qrToken,
        {
          width: 145,
          margin: 1,
          color: {
            dark: '#08070D',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('QR code render error:', error);
        }
      );
    }
  }, [booking?.qrToken]);

  if (!booking) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    const title = booking.eventSnapshot?.title || 'Event';
    const date = new Date(booking.eventSnapshot?.date || Date.now());
    const endDate = new Date(date.getTime() + 3 * 60 * 60 * 1000); // 3 hours default

    const formatDateForICS = (d) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:Event tickets booked via EventLinqs. Booking Ref: ${booking.bookingReference}`,
      `LOCATION:${booking.venueSnapshot?.name || ''}, ${booking.venueSnapshot?.city || ''}`,
      `DTSTART:${formatDateForICS(date)}`,
      `DTEND:${formatDateForICS(endDate)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_Ticket.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
      }}
    >
      {/* The Printable E-Ticket Card */}
      <div
        className="glass-widget-card print-ticket"
        style={{
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'rgba(20, 18, 34, 0.88)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.25)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          borderRadius: '24px',
          position: 'relative',
        }}
      >
        {/* Left Ticket Side (Event Metadata) */}
        <div
          style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
            borderRight: '1px dashed rgba(255, 255, 255, 0.12)',
            position: 'relative',
          }}
        >
          {/* EventLinqs Ticket Brand Banner */}
          <div
            className="ticket-brand-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '-0.2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ticket size={16} color="#FFFFFF" />
              </div>
              <span
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                EVENT<span style={{ color: '#A78BFA' }}>LINQS</span>
              </span>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Verified Live Pass
            </span>
          </div>

          {/* Header Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: '#C4B5FD',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Sparkles size={13} color="#A78BFA" />
              Official Digital Pass
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                background:
                  booking.bookingStatus === 'CONFIRMED'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${
                  booking.bookingStatus === 'CONFIRMED'
                    ? 'rgba(16, 185, 129, 0.4)'
                    : 'rgba(239, 68, 68, 0.4)'
                }`,
                color: booking.bookingStatus === 'CONFIRMED' ? '#34D399' : '#F87171',
                fontSize: '0.78rem',
                fontWeight: 800,
              }}
            >
              <CheckCircle2 size={13} />
              {booking.bookingStatus}
            </span>
          </div>

          {/* Title */}
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.25,
                marginBottom: '0.6rem',
              }}
            >
              {booking.eventSnapshot?.title}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#A78BFA',
                fontSize: '0.92rem',
                fontWeight: 700,
              }}
            >
              <Calendar size={16} />
              <span>
                {formatDate(booking.eventSnapshot?.date)} &bull; {formatTime(booking.eventSnapshot?.date)}
              </span>
            </div>
          </div>

          {/* Venue */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              color: '#CBD5E1',
              fontSize: '0.9rem',
            }}
          >
            <MapPin size={17} color="#A78BFA" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, color: '#FFFFFF' }}>
                {booking.venueSnapshot?.name || 'Grand Arena'}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                {booking.venueSnapshot?.address || 'Main Stadium Complex'}, {booking.venueSnapshot?.city || 'India'}
              </div>
            </div>
          </div>

          {/* Allocated Seats Badges */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#A78BFA',
                marginBottom: '0.6rem',
                textTransform: 'uppercase',
                fontWeight: 800,
                letterSpacing: '0.08em',
              }}
            >
              Allocated Seats ({booking.priceSnapshot?.length || booking.seats?.length})
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(booking.priceSnapshot || []).map((s, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    padding: '0.4rem 0.8rem',
                    borderRadius: '10px',
                    background:
                      s.category === 'VIP'
                        ? 'rgba(139, 92, 246, 0.25)'
                        : s.category === 'Premium'
                        ? 'rgba(99, 102, 241, 0.25)'
                        : 'rgba(56, 189, 248, 0.25)',
                    border: `1px solid ${
                      s.category === 'VIP'
                        ? 'rgba(139, 92, 246, 0.5)'
                        : s.category === 'Premium'
                        ? 'rgba(99, 102, 241, 0.5)'
                        : 'rgba(56, 189, 248, 0.5)'
                    }`,
                    color:
                      s.category === 'VIP'
                        ? '#C4B5FD'
                        : s.category === 'Premium'
                        ? '#A5B4FC'
                        : '#7DD3FC',
                  }}
                >
                  <Ticket size={13} />
                  <span>
                    {s.seatNumber} &bull; {s.category}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Ticket Side (QR Stub & Verification) */}
        <div
          style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            textAlign: 'center',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: '#94A3B8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            Gate Scan Verification
          </div>

          {/* Canvas for QR Code */}
          <div
            style={{
              padding: '10px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <canvas ref={qrCanvasRef} />
          </div>

          {/* Booking Reference Code */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.3rem' }}>
              Booking Reference
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                color: '#A78BFA',
                background: 'rgba(139, 92, 246, 0.15)',
                padding: '0.35rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              {booking.bookingReference}
            </div>
          </div>

          {/* Total Paid */}
          <div style={{ fontSize: '0.92rem', color: '#CBD5E1' }}>
            Paid Total: <strong style={{ color: '#FFFFFF', fontSize: '1.15rem' }}>₹{booking.total?.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '0.5rem',
        }}
      >
        <Button variant="secondary" size="md" icon={Printer} onClick={handlePrint}>
          Print / PDF Pass
        </Button>
        <Button variant="primary" size="md" icon={Calendar} onClick={handleAddToCalendar}>
          Add to Calendar
        </Button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-ticket, .print-ticket * {
            visibility: visible;
          }
          .print-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #0f172a !important;
            border: 2px solid #0f172a !important;
            box-shadow: none !important;
            border-radius: 12px !important;
          }
          .print-ticket .ticket-brand-header {
            border-bottom: 2px solid #0f172a !important;
          }
          .print-ticket .ticket-brand-header span {
            color: #0f172a !important;
            font-weight: 900 !important;
          }
          .print-ticket h2,
          .print-ticket div,
          .print-ticket span,
          .print-ticket strong {
            color: #0f172a !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

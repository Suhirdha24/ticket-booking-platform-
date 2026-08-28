import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Calendar, MapPin, Ticket, Download, Printer, CheckCircle2, QrCode } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function TicketCard({ booking, isNew = false }) {
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    if (isNew) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#eab308', '#f59e0b', '#fbbf24', '#10b981'],
      });
    }
  }, [isNew]);

  useEffect(() => {
    if (qrCanvasRef.current && booking?.qrToken) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        booking.qrToken,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
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
      `DESCRIPTION:Event tickets booked via EventHub. Booking Ref: ${booking.bookingReference}`,
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
        gap: '1.5rem',
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
      }}
    >
      {/* The Printable E-Ticket Card */}
      <div
        className="glass-panel print-ticket"
        style={{
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#131622',
          borderColor: 'rgba(99, 102, 241, 0.4)',
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 30px -10px var(--primary-glow)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Left Ticket Side (Event Metadata) */}
        <div
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            borderRight: '1px dashed var(--border-subtle)',
          }}
        >
          {/* Header Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge badge-primary">
              Official Digital Pass
            </span>
            <span
              className={`badge ${
                booking.bookingStatus === 'CONFIRMED'
                  ? 'badge-success'
                  : 'badge-danger'
              }`}
            >
              <CheckCircle2 size={12} />
              {booking.bookingStatus}
            </span>
          </div>

          {/* Title */}
          <div>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.3,
                marginBottom: '0.5rem',
              }}
            >
              {booking.eventSnapshot?.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#eab308', fontSize: '0.9rem', fontWeight: 600 }}>
              <Calendar size={15} />
              <span>
                {formatDate(booking.eventSnapshot?.date)} &bull; {formatTime(booking.eventSnapshot?.date)}
              </span>
            </div>
          </div>

          {/* Venue */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            <MapPin size={16} color="var(--text-subtle)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: '#ffffff' }}>
                {booking.venueSnapshot?.name}
              </div>
              <div>{booking.venueSnapshot?.city}</div>
            </div>
          </div>

          {/* Seat Badges */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase', fontWeight: 700 }}>
              Allocated Seats ({booking.priceSnapshot?.length || booking.seats?.length})
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(booking.priceSnapshot || []).map((s, idx) => (
                <span
                  key={idx}
                  className="badge badge-primary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                >
                  {s.seatNumber} ({s.category})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Ticket Side (QR Stub & Verification) */}
        <div
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            textAlign: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
            Gate Scan Verification
          </div>

          {/* Canvas for QR Code */}
          <div
            style={{
              padding: '8px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <canvas ref={qrCanvasRef} />
          </div>

          {/* Booking Reference Code */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.2rem' }}>
              Reference Code
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: '#eab308',
              }}
            >
              {booking.bookingReference}
            </div>
          </div>

          {/* Total Paid */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Paid Total: <strong style={{ color: '#ffffff' }}>₹{booking.total?.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Button variant="secondary" size="md" icon={Printer} onClick={handlePrint}>
          Print / PDF
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
            color: #000000 !important;
            border: 2px solid #000000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

import crypto from 'crypto';

const QR_SECRET = process.env.QR_SECRET || 'event_ticket_qr_hmac_secret_2026';

export class QRService {
  /**
   * Generate signed QR token for a confirmed booking
   */
  static generateQRToken(bookingData) {
    const payload = JSON.stringify({
      ref: bookingData.bookingReference,
      bid: bookingData._id.toString(),
      eid: bookingData.event.toString(),
      uid: bookingData.user.toString(),
      seats: bookingData.priceSnapshot.map((s) => s.seatNumber),
      ts: Date.now(),
    });

    const signature = crypto
      .createHmac('sha256', QR_SECRET)
      .update(payload)
      .digest('hex');

    return Buffer.from(JSON.stringify({ payload, sig: signature })).toString('base64');
  }

  /**
   * Verify QR token authenticity
   */
  static verifyQRToken(tokenString) {
    try {
      const decoded = JSON.parse(
        Buffer.from(tokenString, 'base64').toString('utf-8')
      );
      const expectedSignature = crypto
        .createHmac('sha256', QR_SECRET)
        .update(decoded.payload)
        .digest('hex');

      if (decoded.sig !== expectedSignature) {
        return { valid: false, error: 'Invalid QR cryptographic signature' };
      }

      const data = JSON.parse(decoded.payload);
      return { valid: true, data };
    } catch (err) {
      return { valid: false, error: 'Malformed QR token structure' };
    }
  }
}

export default QRService;

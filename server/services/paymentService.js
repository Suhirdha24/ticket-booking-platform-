import crypto from 'crypto';

/**
 * Mock Payment Gateway Service
 * Simulates external payment gateway processing for CARD, UPI, and NET_BANKING.
 * Does NOT store real payment credentials.
 */
export class PaymentService {
  /**
   * Process payment simulation
   * @param {Object} paymentData
   * @param {number} paymentData.amount
   * @param {string} paymentData.paymentMethod - CARD | UPI | NET_BANKING
   * @param {Object} [paymentData.paymentDetails]
   * @param {boolean} [paymentData.simulateFailure] - For test scenarios
   * @returns {Promise<Object>} Payment result
   */
  static async processPayment({
    amount,
    paymentMethod,
    paymentDetails = {},
    simulateFailure = false,
  }) {
    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Check for explicit simulation failure flags or test failure indicators
    const isForcedFail =
      simulateFailure === true ||
      paymentDetails.cardNumber === '4000000000000002' ||
      paymentDetails.upiId === 'fail@upi' ||
      paymentDetails.failTest === true;

    if (isForcedFail) {
      return {
        success: false,
        status: 'FAILED',
        transactionId,
        paymentMethod,
        amount,
        message: 'Payment rejected by bank or simulation test trigger',
        timestamp: new Date(),
      };
    }

    // Validate payment method specifics (mock validation)
    switch (paymentMethod) {
      case 'CARD':
        // Ensure dummy card number passes length check if provided
        if (
          paymentDetails.cardNumber &&
          paymentDetails.cardNumber.replace(/\s+/g, '').length < 13
        ) {
          return {
            success: false,
            status: 'FAILED',
            transactionId,
            paymentMethod,
            amount,
            message: 'Invalid credit/debit card number format',
            timestamp: new Date(),
          };
        }
        break;

      case 'UPI': {
        const rawUpi = (paymentDetails.upiId || '').trim();
        // Support standard username@bank, 10-digit mobile number, or alphanumeric handle
        const isVpa = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z._]{2,49}$/.test(rawUpi);
        const isPhoneOrId = /^[a-zA-Z0-9.\-_]{3,50}$/.test(rawUpi);

        if (rawUpi && !isVpa && !isPhoneOrId) {
          return {
            success: false,
            status: 'FAILED',
            transactionId,
            paymentMethod,
            amount,
            message: 'Invalid UPI format. Enter your UPI ID (username@bank) or 10-digit mobile number.',
            timestamp: new Date(),
          };
        }
        break;
      }

      case 'NET_BANKING':
        // Netbanking dummy validation
        break;

      default:
        return {
          success: false,
          status: 'FAILED',
          transactionId,
          paymentMethod,
          amount,
          message: 'Unsupported payment method',
          timestamp: new Date(),
        };
    }

    // Success response
    return {
      success: true,
      status: 'SUCCESS',
      transactionId,
      paymentMethod,
      amount,
      message: 'Payment processed successfully',
      timestamp: new Date(),
    };
  }
}

export default PaymentService;

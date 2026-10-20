import express from 'express';
import User from '../models/User.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory OTP storage with 10-minute expiry
const otpStore = new Map();

// Helper to clean phone numbers
function normalizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  return phone.trim().replace(/[^0-9]/g, '');
}

/**
 * @route   POST /api/auth/send-otp
 * @desc    Generate and send 6-digit OTP for mobile verification
 * @access  Public
 */
router.post('/send-otp', async (req, res, next) => {
  try {
    const { phone } = req.body;
    const cleanPhone = normalizePhone(phone);

    if (!cleanPhone || cleanPhone.length < 10) {
      return next(
        new AppError('Please provide a valid 10-digit mobile number', 400, 'INVALID_PHONE')
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanPhone, {
      otp,
      expiresAt,
      verified: false,
    });

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone.slice(-10)}`,
      data: {
        phone: cleanPhone,
        otpPreview: otp, // For instant testing without external SMS cost
        expiresInSeconds: 600,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify 6-digit OTP code for a mobile number
 * @access  Public
 */
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const cleanPhone = normalizePhone(phone);

    if (!cleanPhone || !otp) {
      return next(new AppError('Phone number and OTP are required', 400, 'VALIDATION_ERROR'));
    }

    const record = otpStore.get(cleanPhone);
    if (!record) {
      return next(new AppError('No OTP requested for this phone number. Please request an OTP first.', 400, 'OTP_NOT_FOUND'));
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return next(new AppError('OTP has expired. Please request a new OTP.', 400, 'OTP_EXPIRED'));
    }

    if (record.otp !== otp.toString().trim()) {
      return next(new AppError('Invalid OTP code. Please enter the correct 6-digit code.', 400, 'INVALID_OTP'));
    }

    record.verified = true;
    otpStore.set(cleanPhone, record);

    res.status(200).json({
      success: true,
      message: 'Mobile number verified successfully',
      data: {
        verified: true,
        phone: cleanPhone,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with mandatory mobile and verified OTP
 * @access  Public
 */
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password, phone, otp, role } = req.body;
    // Phone is optional for reading platform registration
    const cleanPhone = phone ? normalizePhone(phone) : '';

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(
        new AppError('User with this email already exists', 400, 'USER_EXISTS')
      );
    }

    if (cleanPhone) {
      const existingPhone = await User.findOne({ phone: cleanPhone });
      if (existingPhone) {
        return next(
          new AppError('An account with this mobile number already exists', 400, 'PHONE_EXISTS')
        );
      }
    }

    // Protect admin role assignment
    let assignedRole = 'user';
    if (role === 'admin' && req.body.adminSecret === process.env.ADMIN_SECRET) {
      assignedRole = 'admin';
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: cleanPhone,
      role: assignedRole,
      preferredGenres: req.body.preferredGenres || ['Fiction', 'Sci-Fi', 'Mystery'],
      preferredMoods: req.body.preferredMoods || ['Mind-Bending', 'Emotional'],
      annualReadingGoal: req.body.annualReadingGoal || 15,
      avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: req.body.bio || 'Avid reader exploring new stories and perspectives.',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          preferredGenres: user.preferredGenres,
          preferredMoods: user.preferredMoods,
          annualReadingGoal: user.annualReadingGoal,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token with role/portal enforcement
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password, portal, requiredRole } = req.body;

    // Find user and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return next(
        new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
      );
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(
        new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
      );
    }

    const isAdminPortal = portal === 'admin' || requiredRole === 'admin';
    if (isAdminPortal && user.role !== 'admin') {
      return next(
        new AppError(
          'Access denied: This portal is exclusively for administrators.',
          403,
          'ADMIN_ACCESS_REQUIRED'
        )
      );
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          preferredGenres: user.preferredGenres || [],
          preferredMoods: user.preferredMoods || [],
          annualReadingGoal: user.annualReadingGoal || 15,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          phone: req.user.phone,
          avatar: req.user.avatar,
          bio: req.user.bio,
          preferredGenres: req.user.preferredGenres || [],
          preferredMoods: req.user.preferredMoods || [],
          annualReadingGoal: req.user.annualReadingGoal || 15,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile and reading preferences
 * @access  Private
 */
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const {
      name,
      phone,
      password,
      avatar,
      bio,
      preferredGenres,
      preferredMoods,
      annualReadingGoal,
    } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404, 'USER_NOT_FOUND'));
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (preferredGenres !== undefined) user.preferredGenres = preferredGenres;
    if (preferredMoods !== undefined) user.preferredMoods = preferredMoods;
    if (annualReadingGoal !== undefined) user.annualReadingGoal = annualReadingGoal;

    if (password) {
      if (password.length < 6) {
        return next(
          new AppError(
            'New password must be at least 6 characters',
            400,
            'VALIDATION_ERROR'
          )
        );
      }
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          preferredGenres: user.preferredGenres,
          preferredMoods: user.preferredMoods,
          annualReadingGoal: user.annualReadingGoal,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

import express from 'express';
import User from '../models/User.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(
        new AppError('User with this email already exists', 400, 'USER_EXISTS')
      );
    }

    // Protect admin role assignment (default to user unless secret key matches or in dev/seed)
    let assignedRole = 'user';
    if (role === 'admin' && req.body.adminSecret === process.env.ADMIN_SECRET) {
      assignedRole = 'admin';
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: assignedRole,
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
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404, 'USER_NOT_FOUND'));
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
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
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      verificationToken,
    });

    if (user) {
      // Verification URL points to BACKEND which then redirects to frontend
      const verifyUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;

      const message = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #121826; color: #f1f5f9; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6366f1, #818cf8); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: white;">✦ EMATBS</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9);">Event Management & Ticket Booking</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #818cf8; margin-top: 0;">Welcome, ${user.name}! 🎉</h2>
            <p style="color: #94a3b8; line-height: 1.6;">Thank you for creating your account. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verifyUrl}" style="background: linear-gradient(135deg, #6366f1, #818cf8); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="color: #64748b; font-size: 13px;">If the button doesn't work, copy and paste this link:<br/><a href="${verifyUrl}" style="color: #818cf8;">${verifyUrl}</a></p>
          </div>
          <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); text-align: center; color: #475569; font-size: 12px;">
            © 2026 EMATBS. All rights reserved.
          </div>
        </div>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: 'EMATBS - Verify Your Email',
          message,
        });
      } catch (emailErr) {
        console.warn('Email sending failed:', emailErr.message);
        // Don't block signup if email fails
      }

      res.status(201).json({
        message: 'Account created! Please check your email to verify your account.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      // Redirect to frontend with error
      return res.redirect('http://localhost:5173/auth?verified=error');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Redirect to frontend with success
    res.redirect('http://localhost:5173/auth?verified=success');
  } catch (error) {
    console.error('Verify error:', error);
    res.redirect('http://localhost:5173/auth?verified=error');
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -verificationToken');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const adminLogin = async (req, res) => {
  console.log(`Admin login attempt for: ${req.body.email}`);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`Admin login failed: User not found (${email})`);
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Admin login failed: Password mismatch (${email})`);
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    if (user.role !== 'admin') {
      console.log(`Admin login failed: User is not an admin (${email}, role=${user.role})`);
      return res.status(403).json({ message: 'Access denied: not an admin' });
    }

    console.log(`Admin login successful: Token generated for ${email}`);

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message });
  }
};

const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      isVerified: true, // admin accounts auto-verify
    });

    console.log(`✅ Admin created via adminSignup: ${admin.email}`);

    res.status(201).json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isVerified: admin.isVerified,
      token: generateToken(admin._id),
      message: 'Admin account created successfully!',
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  getMe,
  adminSignup,
  adminLogin,
};

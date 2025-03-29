const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { 
      email,
      passwordLength: password?.length,
      password: password
    });
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    console.log('User found:', { 
      id: user._id, 
      email: user.email, 
      isAdmin: user.isAdmin,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    });
    
    // Check if user is admin
    if (!user.isAdmin) {
      console.log('User is not admin');
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin only.'
      });
    }
    
    // Check password
    console.log('Attempting password comparison');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.avatar,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Google login
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, error: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    console.log('Verifying Google token...');
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    console.log('Google payload:', payload);
    
    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      console.log('Creating new user...');
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        avatar: payload.picture,
        isAdmin: false
      });
    } else {
      console.log('Updating existing user...');
      if (!user.googleId) {
        user.googleId = payload.sub;
      }
      if (!user.avatar) {
        user.avatar = payload.picture;
      }
      await user.save();
    }
    
    const jwtToken = generateToken(user);
    
    console.log('Sending response with user data...');
    res.json({
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.avatar,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (error) {
    console.error('Error in googleLogin:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error during Google login' });
  }
};

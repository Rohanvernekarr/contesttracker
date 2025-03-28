require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contest-tracker');
    console.log('Connected to MongoDB');

    // Delete existing admin user if exists
    await User.deleteOne({ email: 'admin@contesttracker.com' });
    console.log('Deleted existing admin user if any');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    console.log('Generated hashed password:', {
      length: hashedPassword.length,
      startsWith: hashedPassword.substring(0, 10) + '...'
    });

    // Create new admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@contesttracker.com',
      password: hashedPassword,
      isAdmin: true
    });

    console.log('Admin user created successfully:', {
      id: adminUser._id,
      hasPassword: !!adminUser.password,
      passwordLength: adminUser.password?.length,
      isAdmin: adminUser.isAdmin
    });

    // Verify the user was created correctly
    const verifyUser = await User.findOne({ email: 'admin@contesttracker.com' });
    console.log('Verification after creation:', {
      exists: !!verifyUser,
      hasPassword: !!verifyUser?.password,
      passwordLength: verifyUser?.password?.length,
      isAdmin: verifyUser?.isAdmin
    });

    process.exit(0);
  } catch (error) {
    console.error('Error managing admin user:', error);
    process.exit(1);
  }
};

createAdminUser(); 
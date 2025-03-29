const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google auth
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    console.log("Password hashing process:", {
      originalPassword: this.password,
      passwordLength: this.password?.length,
      isModified: this.isModified('password')
    });
    
    // Check if the password is already hashed
    if (this.password.startsWith('$2a$')) {
      console.log("Password is already hashed, skipping...");
      return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    console.log("Generated salt:", salt);
    
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed password:", {
      hash: this.password,
      hashLength: this.password?.length
    });
    
    next();
  } catch (error) {
    console.error("Error in password hashing:", error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Password comparison:', {
      hasPassword: !!this.password,
      storedHashLength: this.password?.length,
      candidateLength: candidatePassword?.length,
      candidatePassword: candidatePassword,
      storedHash: this.password?.substring(0, 10) + '...'
    });
    
    if (!this.password) {
      console.log('No password stored for user');
      return false;
    }
    
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('bcrypt.compare result:', result);
    return result;
  } catch (error) {
    console.error('Error in comparePassword:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);

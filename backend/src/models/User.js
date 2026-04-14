import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, default: '' },
  
  // App settings for this user
  settings: {
    address: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    currency: { type: String, default: 'USD' }
  }
}, { timestamps: true });

// Hash the password before saving to the database
// FIX: Removed 'next' from the parameters and just using 'return;'
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; 
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed database password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
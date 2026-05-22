import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: { type: String, required: true, minlength: 8, select: false },
    avatar: { type: String, default: '' },
    bio: { type: String, default: 'Building better work with the team.', maxlength: 280 },
    skills: [{ type: String, trim: true }],
    role: { type: String, enum: ['admin', 'manager', 'member'], default: 'member' },
    status: { type: String, enum: ['online', 'offline', 'busy'], default: 'offline' },
    lastSeen: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
    refreshTokenVersion: { type: Number, default: 0 },
    stats: {
      tasksCompleted: { type: Number, default: 0 },
      messagesSent: { type: Number, default: 0 },
      filesShared: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);

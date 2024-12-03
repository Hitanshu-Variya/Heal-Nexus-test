import { model, Schema } from 'mongoose';
import { userRole } from '../../Utilites/options.js';

const userSchema = new Schema({
  userName: { type: String, required: true},
  email: { type: String, required: true, unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(userRole), default: userRole.PATIENT },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationCode: String,
  verificationCodeExpiresAt: Date
}, { timestamps: true });

const User = model("User", userSchema);
export default User;

import { Schema } from "mongoose";
import { Gender, UserRole, UserStatus } from "../constants/enums";

export const baseModelFields = {
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    immutable: true,
    index: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
  },

  dob: { type: Date },

  phone: { type: String, unique: true, sparse: true, index: true },

  gender: {
    type: String,
    enum: Object.values(Gender),
    lowercase: true,
  },

  location: {
    division: { type: String, trim: true },
    district: { type: String, trim: true },
    address: { type: String, trim: true },
  },

  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE,
    index: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
    index: true,
  },

  resetOtp: {
    type: String,
  },

  resetOtpExpiryAt: {
    type: Date,
  },

  verifyOtp: {
    type: String,
  },

  verifyOtpExpiryAt: {
    type: Date,
    index: { expires: 0 },
  },
};

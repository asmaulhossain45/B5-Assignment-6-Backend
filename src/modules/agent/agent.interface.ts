import { Types } from "mongoose";
import { Gender, UserRole, UserStatus } from "../../constants/enums";
import { ILocation } from "../../interfaces/common.interface";

export interface IAgent {
  _id?: Types.ObjectId;

  name: string;
  email: string;
  password: string;

  dob?: Date;
  phone?: string;
  gender?: Gender;

  role: UserRole.AGENT;

  businessName?: string;
  location?: ILocation;

  wallet?: Types.ObjectId;

  status: UserStatus;
  isVerified: boolean;

  resetOtp?: string;
  verifyOtp?: string;
  resetOtpExpiryAt?: Date;
  verifyOtpExpiryAt?: Date;

  isApproved: boolean;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

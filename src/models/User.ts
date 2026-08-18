import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  occupation: string;
  age: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  personalIdNumber?: string;
  refNumber: string;
  selectedPackage?: 'Basic' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  grantAmount?: number;
  feeAmount?: number;
  paymentStatus: 'pending' | 'paid' | 'delivered';
  paymentReceipt?: string;
  googleId?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    occupation: { type: String, required: true },
    age: { type: Number },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    personalIdNumber: { type: String },
    refNumber: { type: String, default: 'BE6006/85428', unique: true },
    selectedPackage: { type: String, enum: ['Basic', 'Silver', 'Gold', 'Platinum', 'Diamond'] },
    grantAmount: { type: Number },
    feeAmount: { type: Number },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'delivered'], default: 'pending' },
    paymentReceipt: { type: String },
    googleId: { type: String, sparse: true },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.default.genSalt(10);
    this.password = await bcrypt.default.hash(this.password || '', salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.default.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);

import mongoose, { Schema, Document, models } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specializationId: string;
  hospitalId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  experience: number;
  qualifications: string[];
  consultationFee: number;
  availableDays: string[];
  availableHours: string[];
  bio?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    phone: { 
      type: String, 
      required: true,
      match: [/^(\+94|0)[0-9]{9}$/, 'Invalid phone number format']
    },
    licenseNumber: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^[A-Z]{2}[0-9]{6}$/, 'Invalid license number format']
    },
    specializationId: { type: String, required: true },
    hospitalId: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'REJECTED'],
      default: 'PENDING',
    },
    experience: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 50 
    },
    qualifications: { 
      type: [String], 
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: 'At least one qualification is required'
      }
    },
    consultationFee: { 
      type: Number, 
      required: true, 
      min: 500, 
      max: 10000 
    },
    availableDays: { 
      type: [String], 
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: 'At least one available day is required'
      }
    },
    availableHours: { 
      type: [String], 
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: 'At least one available hour is required'
      }
    },
    bio: { type: String, maxlength: 1000 },
    profileImage: { type: String },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// Indexes for better performance
DoctorSchema.index({ email: 1 });
DoctorSchema.index({ licenseNumber: 1 });
DoctorSchema.index({ specializationId: 1 });
DoctorSchema.index({ hospitalId: 1 });
DoctorSchema.index({ status: 1 });
DoctorSchema.index({ name: 1 });

const Doctor = models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);
export default Doctor;

import mongoose, { Schema, Document, models } from "mongoose";

export interface IHospital extends Document {
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  registrationNumber: string;
  licenseNumber: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true, maxlength: 200 },
    address: { type: String, required: true, maxlength: 500 },
    city: { type: String, required: true, maxlength: 100 },
    province: { type: String, required: true, maxlength: 100 },
    phone: { 
      type: String, 
      required: true,
      match: [/^(\+94|0)[0-9]{9}$/, 'Invalid phone number format']
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    website: { 
      type: String,
      match: [/^https?:\/\/.+/, 'Invalid website URL']
    },
    description: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL'],
      default: 'PENDING_APPROVAL',
    },
    registrationNumber: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^[A-Z]{2}[0-9]{8}$/, 'Invalid registration number format']
    },
    licenseNumber: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/^[A-Z]{2}[0-9]{6}$/, 'Invalid license number format']
    },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// Indexes for better performance
HospitalSchema.index({ email: 1 });
HospitalSchema.index({ status: 1 });
HospitalSchema.index({ city: 1 });
HospitalSchema.index({ province: 1 });
HospitalSchema.index({ registrationNumber: 1 });
HospitalSchema.index({ licenseNumber: 1 });

const Hospital = models.Hospital || mongoose.model<IHospital>("Hospital", HospitalSchema);
export default Hospital;

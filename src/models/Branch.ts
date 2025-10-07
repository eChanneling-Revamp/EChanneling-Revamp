import mongoose, { Schema, Document, models } from "mongoose";

export interface IBranch extends Document {
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  hospitalId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    name: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    address: { 
      type: String, 
      required: true, 
      maxlength: 500 
    },
    city: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    province: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    phone: { 
      type: String, 
      required: true,
      match: [/^(\+94|0)[0-9]{9}$/, 'Invalid phone number format']
    },
    email: { 
      type: String, 
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
    },
    hospitalId: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

// Indexes for better performance
BranchSchema.index({ hospitalId: 1 });
BranchSchema.index({ status: 1 });
BranchSchema.index({ city: 1 });
BranchSchema.index({ province: 1 });

const Branch = models.Branch || mongoose.model<IBranch>("Branch", BranchSchema);
export default Branch;

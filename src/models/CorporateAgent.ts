import mongoose, { Schema, Document, models } from "mongoose";

export interface ICorporateAgent extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  contactPerson: string;
  status: 'ACTIVE' | 'INACTIVE';
  commissionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const CorporateAgentSchema = new Schema<ICorporateAgent>(
  {
    name: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
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
    company: { 
      type: String, 
      required: true, 
      maxlength: 200 
    },
    address: { 
      type: String, 
      required: true, 
      maxlength: 500 
    },
    contactPerson: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    commissionRate: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    },
  },
  { timestamps: true }
);

// Indexes for better performance
CorporateAgentSchema.index({ email: 1 });
CorporateAgentSchema.index({ status: 1 });
CorporateAgentSchema.index({ company: 1 });

const CorporateAgent = models.CorporateAgent || mongoose.model<ICorporateAgent>("CorporateAgent", CorporateAgentSchema);
export default CorporateAgent;

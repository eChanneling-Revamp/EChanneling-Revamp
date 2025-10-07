import mongoose, { Schema, Document, models } from "mongoose";

export interface IFee extends Document {
  name: string;
  description?: string;
  amount: number;
  type: 'CONSULTATION' | 'REGISTRATION' | 'PROCESSING' | 'OTHER';
  hospitalId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema = new Schema<IFee>(
  {
    name: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    description: { type: String, maxlength: 500 },
    amount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    type: {
      type: String,
      enum: ['CONSULTATION', 'REGISTRATION', 'PROCESSING', 'OTHER'],
      required: true,
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
FeeSchema.index({ hospitalId: 1 });
FeeSchema.index({ type: 1 });
FeeSchema.index({ status: 1 });

const Fee = models.Fee || mongoose.model<IFee>("Fee", FeeSchema);
export default Fee;

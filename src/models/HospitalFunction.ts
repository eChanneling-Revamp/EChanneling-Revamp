import mongoose, { Schema, Document, models } from "mongoose";

export interface IHospitalFunction extends Document {
  name: string;
  description?: string;
  hospitalId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const HospitalFunctionSchema = new Schema<IHospitalFunction>(
  {
    name: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    description: { type: String, maxlength: 500 },
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
HospitalFunctionSchema.index({ hospitalId: 1 });
HospitalFunctionSchema.index({ status: 1 });
HospitalFunctionSchema.index({ name: 1 });

const HospitalFunction = models.HospitalFunction || mongoose.model<IHospitalFunction>("HospitalFunction", HospitalFunctionSchema);
export default HospitalFunction;

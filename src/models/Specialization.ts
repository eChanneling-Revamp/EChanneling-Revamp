import mongoose, { Schema, Document, models } from "mongoose";

export interface ISpecialization extends Document {
  name: string;
  nameSinhala?: string;
  nameTamil?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const SpecializationSchema = new Schema<ISpecialization>(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      maxlength: 100 
    },
    nameSinhala: { type: String, maxlength: 100 },
    nameTamil: { type: String, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

// Indexes for better performance
SpecializationSchema.index({ name: 1 });
SpecializationSchema.index({ status: 1 });

const Specialization = models.Specialization || mongoose.model<ISpecialization>("Specialization", SpecializationSchema);
export default Specialization;

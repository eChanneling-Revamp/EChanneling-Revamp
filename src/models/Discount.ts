import mongoose, { Schema, Document, models } from "mongoose";

export interface IDiscount extends Document {
  name: string;
  description?: string;
  percentage?: number;
  fixedAmount?: number;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  hospitalId: string;
  validFrom: Date;
  validTo: Date;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema = new Schema<IDiscount>(
  {
    name: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    description: { type: String, maxlength: 500 },
    percentage: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
    fixedAmount: { 
      type: Number, 
      min: 0 
    },
    type: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
      required: true,
    },
    hospitalId: { type: String, required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

// Validation to ensure either percentage or fixedAmount is provided based on type
DiscountSchema.pre('validate', function(next) {
  if (this.type === 'PERCENTAGE' && !this.percentage) {
    next(new Error('Percentage is required for percentage type discount'));
  } else if (this.type === 'FIXED_AMOUNT' && !this.fixedAmount) {
    next(new Error('Fixed amount is required for fixed amount type discount'));
  } else {
    next();
  }
});

// Validation to ensure validTo is after validFrom
DiscountSchema.pre('validate', function(next) {
  if (this.validTo <= this.validFrom) {
    next(new Error('Valid to date must be after valid from date'));
  } else {
    next();
  }
});

// Indexes for better performance
DiscountSchema.index({ hospitalId: 1 });
DiscountSchema.index({ type: 1 });
DiscountSchema.index({ status: 1 });
DiscountSchema.index({ validFrom: 1 });
DiscountSchema.index({ validTo: 1 });

const Discount = models.Discount || mongoose.model<IDiscount>("Discount", DiscountSchema);
export default Discount;

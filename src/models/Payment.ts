import mongoose, { Schema, Document, models } from "mongoose";

export interface IPayment extends Document {
  amount: number;
  currency: string;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  reference?: string;
  description?: string;
  userId: string;
  invoiceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    amount: { 
      type: Number, 
      required: true, 
      min: 0.01 
    },
    currency: { 
      type: String, 
      required: true, 
      default: 'LKR' 
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_PAYMENT'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    transactionId: { type: String },
    reference: { type: String },
    description: { type: String, maxlength: 500 },
    userId: { type: String, required: true },
    invoiceId: { type: String },
  },
  { timestamps: true }
);

// Indexes for better performance
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ invoiceId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentMethod: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ createdAt: -1 });

const Payment = models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;

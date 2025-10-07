import mongoose, { Schema, Document, models } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: Date;
  userId: string;
  doctorId?: string;
  hospitalId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { 
      type: String, 
      required: true, 
      unique: true 
    },
    amount: { 
      type: Number, 
      required: true, 
      min: 0.01 
    },
    tax: { 
      type: Number, 
      required: true, 
      min: 0,
      default: 0
    },
    totalAmount: { 
      type: Number, 
      required: true, 
      min: 0.01 
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
      default: 'PENDING',
    },
    dueDate: { type: Date, required: true },
    userId: { type: String, required: true },
    doctorId: { type: String },
    hospitalId: { type: String },
    description: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate total amount
InvoiceSchema.pre('save', function(next) {
  this.totalAmount = this.amount + this.tax;
  next();
});

// Indexes for better performance
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ userId: 1 });
InvoiceSchema.index({ doctorId: 1 });
InvoiceSchema.index({ hospitalId: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ createdAt: -1 });

const Invoice = models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
export default Invoice;

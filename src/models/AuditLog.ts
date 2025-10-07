import mongoose, { Schema, Document, models } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  hospitalId?: string;
  doctorId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { 
      type: String, 
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VERIFY', 'APPROVE', 'REJECT', 'PAYMENT', 'EXPORT']
    },
    entityType: { 
      type: String, 
      required: true,
      enum: ['USER', 'HOSPITAL', 'DOCTOR', 'SPECIALIZATION', 'HOSPITAL_FUNCTION', 'CORPORATE_AGENT', 'PAYMENT', 'FEE', 'DISCOUNT', 'BRANCH', 'INVOICE']
    },
    entityId: { type: String, required: true },
    userId: { type: String, required: true },
    hospitalId: { type: String },
    doctorId: { type: String },
    oldValues: { type: Schema.Types.Mixed },
    newValues: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes for better performance
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ entityType: 1 });
AuditLogSchema.index({ entityId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ hospitalId: 1 });
AuditLogSchema.index({ doctorId: 1 });
AuditLogSchema.index({ createdAt: -1 });

const AuditLog = models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
export default AuditLog;

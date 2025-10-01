import mongoose, { Schema, Document, models } from "mongoose";

export type AppointmentType = "walk-in" | "call-booking" | "online";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface IAppointment extends Document {
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  registrationNumber?: string; // Hospital patient registration number
  doctorId: string;
  sessionId: string;
  hospitalId: string;
  appointmentDate: Date;
  appointmentTime: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentUrl?: string;
  fee: number;
  notes?: string;
  createdBy: string; // Staff member who created the appointment
  isInterHospital: boolean;
  originHospitalId?: string; // For inter-hospital appointments
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentNumber: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientEmail: { type: String },
    registrationNumber: { type: String }, // Hospital patient reg number
    doctorId: { type: String, required: true },
    sessionId: { type: String, required: true },
    hospitalId: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    appointmentType: {
      type: String,
      enum: ["walk-in", "call-booking", "online"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentUrl: { type: String },
    fee: { type: Number, required: true },
    notes: { type: String },
    createdBy: { type: String, required: true },
    isInterHospital: { type: Boolean, default: false },
    originHospitalId: { type: String },
  },
  { timestamps: true }
);

const Appointment = models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);
export default Appointment;
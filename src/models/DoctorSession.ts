import mongoose, { Schema, Document, models } from "mongoose";

export interface IDoctorSession extends Document {
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  date: Date;
  startTime: string;
  endTime: string;
  maxAppointments: number;
  currentAppointments: number;
  fee: number;
  status: "active" | "cancelled" | "completed";
  isRecurring: boolean;
  recurringDays?: string[]; // ["monday", "wednesday", "friday"]
  recurringEndDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSessionSchema = new Schema<IDoctorSession>(
  {
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    hospitalId: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    maxAppointments: { type: Number, required: true },
    currentAppointments: { type: Number, default: 0 },
    fee: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
    isRecurring: { type: Boolean, default: false },
    recurringDays: [{ type: String }],
    recurringEndDate: { type: Date },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const DoctorSession = models.DoctorSession || mongoose.model<IDoctorSession>("DoctorSession", DoctorSessionSchema);
export default DoctorSession;
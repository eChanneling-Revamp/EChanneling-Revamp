import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISession extends Document {
  doctorName: string;
  specialization: string;
  date: Date;
  time: string;
  room: string;
  appointments: number;
  maxAppointments: number;
  status: "active" | "cancelled";
  createdAt: Date;
}

export const SessionSchema = new Schema<ISession>(
  {
    doctorName: { type: String, required: true },
    specialization: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    room: { type: String, required: true },
    appointments: { type: Number, default: 0 },
    maxAppointments: { type: Number, required: true },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

export default models.Session || model<ISession>("Session", SessionSchema);
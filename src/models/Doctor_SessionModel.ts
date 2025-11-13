import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISession extends Document {
  hospital: string;
  roomNumber: string;
  date: Date;
  startTime: string;
  endTime: string;
  maxAppointments: number;
  appointmentDuration: number;
  fee: number;
  bookedAppointments: number;
  status: "active" | "cancelled";
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    hospital: { type: String, required: true },
    roomNumber: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    maxAppointments: { type: Number, required: true },
    appointmentDuration: { type: Number, required: true },
    fee: { type: Number, required: true },
    bookedAppointments: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

export default models.Session || model<ISession>("Session", SessionSchema);
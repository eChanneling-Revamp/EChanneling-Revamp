import mongoose, { Schema, Document, models } from "mongoose";

export type Role = "admin" | "user" | "hospital" | "doctor";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "user", "hospital", "doctor"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;

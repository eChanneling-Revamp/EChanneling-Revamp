import mongoose, { Schema, models } from "mongoose";

const DoctorSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        slmcNumber: { type: String, required: true },
        nicNumber: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        specialization: { type: String, required: true },
    },
    { timestamps: true }
);


const Doctor = models.Doctor || mongoose.model("Doctor", DoctorSchema);
export default Doctor;
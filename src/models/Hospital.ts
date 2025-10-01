import mongoose, { Schema, models } from "mongoose";

const HospitalSchema = new Schema(
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


const Hospital = models.Hospital || mongoose.model("Hospital", HospitalSchema);
export default Hospital;
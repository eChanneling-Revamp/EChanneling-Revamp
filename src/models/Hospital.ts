import mongoose, { Schema, Document, models } from "mongoose";

export type HospitalType = "Private General Hospital" | "Private Specialty Hospital" | "Government Hospital";

export interface IHospital extends Document {
  name: string;
  registrationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId: string;
  contactNumber: string;
  email: string;
  hospitalType: HospitalType;
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    registrationNumber: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: "Sri Lanka" }
    },
    taxId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    contactNumber: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    hospitalType: {
      type: String,
      enum: ["Private General Hospital", "Private Specialty Hospital", "Government Hospital"],
      required: true
    },
    operatingHours: {
      monday: { 
        open: { type: String, default: "08:00" }, 
        close: { type: String, default: "17:00" }, 
        isOpen: { type: Boolean, default: true } 
      },
      tuesday: { 
        open: { type: String, default: "08:00" }, 
        close: { type: String, default: "17:00" }, 
        isOpen: { type: Boolean, default: true } 
      },
      wednesday: { 
        open: { type: String, default: "08:00" }, 
        close: { type: String, default: "17:00" }, 
        isOpen: { type: Boolean, default: true } 
      },
      thursday: { 
        open: { type: String, default: "08:00" }, 
        close: { type: String, default: "17:00" }, 
        isOpen: { type: Boolean, default: true } 
      },
      friday: { 
        open: { type: String, default: "08:00" }, 
        close: { type: String, default: "17:00" }, 
        isOpen: { type: Boolean, default: true } 
      },
      saturday: { 
        open: { type: String, default: "08:00" }, 
        close: { type: String, default: "12:00" }, 
        isOpen: { type: Boolean, default: true } 
      },
      sunday: { 
        open: { type: String, default: "09:00" }, 
        close: { type: String, default: "12:00" }, 
        isOpen: { type: Boolean, default: false } 
      }
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

const Hospital = models.Hospital || mongoose.model<IHospital>("Hospital", HospitalSchema);
export default Hospital;
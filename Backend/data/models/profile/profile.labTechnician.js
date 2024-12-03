import { model, Schema, Types } from 'mongoose';

const labTechnicianSchema = new Schema({
  userID: { type: Types.ObjectId, ref: 'User' },
  qualifications: { type: [String], required: true },
  associatedLab: { type: String, required: true },
  specialization: { type: [String], default: [] },
  contactNumber: { type: String },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  certifications: { type: [String], default: [] },
  yearsOfExperience: { type: Number },
  image: {type: String, reqired: true},
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const LabTechnicianProfile = model("LabTechnicianProfile", labTechnicianSchema);
export default LabTechnicianProfile;

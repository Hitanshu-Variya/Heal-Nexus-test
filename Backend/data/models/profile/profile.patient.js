import { model, Schema, Types } from 'mongoose';

const patientSchema = new Schema({
  userID: { type: Types.ObjectId, ref: 'User' },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contactNumber: { type: String },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    contactNumber: { type: String }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  medicalHistory: { type: [String], default: [] },
  image: {type: String, reqired: true},
  isVerified: {type: Boolean, default: true},
  createdAt: { type: Date, default: Date.now }
});

const PatientProfile = model("PatientProfile", patientSchema);
export default PatientProfile;
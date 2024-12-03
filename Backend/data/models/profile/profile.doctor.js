import { model, Schema, Types } from 'mongoose';

const doctorSchema = new Schema({
  userID: { type: Types.ObjectId, ref: 'User' },
  specialty: { type: String, required: true },
  qualifications: { type: [String], required: true },
  experience: { type: Number, required: true },
  contactNumber: { type: String },
  clinicAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  ratings: { type: [Number], default: [] },
  biography: { type: String },
  consultationFee: { type: Number },
  image: { type: String, reqired: true },
  available: { type: Boolean, default: true },
  slot_booked: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  isVerified: {type: Boolean, default: false}
}, { timestamps: true });

const DoctorProfile = model("DoctorProfile", doctorSchema);
export default DoctorProfile;

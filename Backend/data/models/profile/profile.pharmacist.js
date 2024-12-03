import { model, Schema, Types } from 'mongoose';

const pharmacistSchema = new Schema({
  userID: { type: Types.ObjectId, ref: 'User' },
  certification: { type: String, required: true },
  pharmacyName: { type: String, required: true },
  pharmacyLocation: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  contactNumber: { type: String },
  yearsOfExperience: { type: Number },
  image: {type: String, reqired: true},
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const PharmacistProfile = model("PharmacistProfile", pharmacistSchema);
export default PharmacistProfile;
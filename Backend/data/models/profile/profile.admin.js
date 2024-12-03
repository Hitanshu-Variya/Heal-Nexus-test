import { model, Schema, Types } from 'mongoose';

const adminSchema = new Schema({
  userID: { type: Types.ObjectId, ref: 'User' },
  permissions: { type: [String], default: ['manageUsers', 'viewReports'] },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const AdminProfile = model("AdminProfile", adminSchema);
export default AdminProfile;
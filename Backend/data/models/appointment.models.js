import { model, Schema, Types } from 'mongoose';

const appointmentSchema = new Schema({
    patientID: { type: Types.ObjectId, ref: 'PatientProfile' },
    doctorID: { type: Types.ObjectId, ref: 'DoctorProfile' },
    slotTime: { type: String, required: true },
    slotDate: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancel: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Appointment = model("appointment", appointmentSchema);
export default Appointment;
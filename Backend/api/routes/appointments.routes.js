import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import { bookAppointment, getPatientAppointments, cancelAppointment, confirmAppointment } from '../controllers/appointment.controller.js';

const router = express.Router();
router.post("/book-appointment", verifyToken, bookAppointment);
router.get("/get-patient-appointments", verifyToken, getPatientAppointments);
router.put("/cancel-appointment/:appointmentID", verifyToken, cancelAppointment);
router.put("/pay-book-appointment/:appointmentID", verifyToken, confirmAppointment);

export default router;

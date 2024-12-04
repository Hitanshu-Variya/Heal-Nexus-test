import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import { bookAppointment, getPatientAppointments, cancelAppointment, confirmAppointment, getBookedSlots } from '../controllers/appointment.controller.js';

const router = express.Router();
router.post("/book-appointment", verifyToken, bookAppointment);
router.get("/get-patient-appointments", verifyToken, getPatientAppointments);
router.put("/cancel-appointment/:appointmentID", verifyToken, cancelAppointment);
router.put("/pay-book-appointment/:appointmentID", verifyToken, confirmAppointment);
router.get("/booked-slots/:doctorId", verifyToken, getBookedSlots);

export default router;

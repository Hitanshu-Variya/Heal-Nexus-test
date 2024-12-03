import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import { getDoctorName, changeAvailablity, doctorlist, appointmentsDoctor, completeAppointment, doctorDashboard } from '../controllers/doctor.controller.js';

const router = express.Router();
router.get("/get-doctor-name", verifyToken, getDoctorName)
router.post("/change-availability", verifyToken, changeAvailablity);
router.get("/doctor-list", verifyToken, doctorlist);
router.get("/appointments", verifyToken, appointmentsDoctor);
router.post("/complete-appointment", verifyToken, completeAppointment);
router.get("/dashboard", verifyToken, doctorDashboard);

export default router;

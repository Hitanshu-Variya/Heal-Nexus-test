import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import { getAdminProfile, updateAdminProfile, adminLogin, allVerifiedDoctors, allUnVerifiedDoctors, approveDoctor, appointmentsAdmin, adminDashboard } from '../controllers/admin.controller.js';

const router = express.Router();
router.post("/signup", adminLogin);
router.get("/get-profile/:id", getAdminProfile);
router.put("/update-profile/:id", updateAdminProfile);
router.get("/get-verified-doctors",verifyToken, allVerifiedDoctors);
router.get("/get-unverified-doctors", verifyToken, allUnVerifiedDoctors);
router.put("/approve-doctor/:doctorID", verifyToken, approveDoctor);
router.get("/appointments", verifyToken, appointmentsAdmin);
router.get("/dashboard", verifyToken, adminDashboard);

export default router;

import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import {
  createPatientProfile,
  updatePatientProfile,
  getPatientProfile,
  createDoctorProfile,
  updateDoctorProfile,
  getDoctorProfile,
  createLabTechnicianProfile,
  updateLabTechnicianProfile,
  getLabTechnicianProfile,
  createPharmacistProfile,
  updatePharmacistProfile,
  getPharmacistProfile,
} from '../controllers/profile.controller.js';
import upload from '../../middleware/multer.js';

const router = express.Router();

router.post('/create-patient', verifyToken, upload.single('image'), createPatientProfile);
router.put('/update-patient', verifyToken, upload.single('image'), updatePatientProfile);
router.get('/get-patient', verifyToken, getPatientProfile);

router.post('/create-doctor', verifyToken, upload.single('image'), createDoctorProfile);
router.put('/update-doctor/:id', verifyToken, updateDoctorProfile);
router.get('/get-doctor/:id', verifyToken, getDoctorProfile);

router.post('/create-lab-technician', verifyToken, upload.single('image'), createLabTechnicianProfile);
router.put('/update-lab-technician/:id', verifyToken, updateLabTechnicianProfile);
router.get('/get-lab-technician/:id', verifyToken, getLabTechnicianProfile);

router.post('/create-pharmacist', verifyToken, upload.single('image'), createPharmacistProfile);
router.put('/update-pharmacist/:id', verifyToken, updatePharmacistProfile);
router.get('/get-pharmacist/:id', verifyToken, getPharmacistProfile);

export default router;

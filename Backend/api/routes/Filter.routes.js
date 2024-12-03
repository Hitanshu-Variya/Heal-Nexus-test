import express from 'express';
import { filterDoctorsByState, filterDoctorsByCity } from '../controllers/dashboard.controller.js';

const router = express.Router();
router.get("/search-by-city", filterDoctorsByCity);
router.get("/search-by-state", filterDoctorsByState);

export default router;

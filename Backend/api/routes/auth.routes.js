import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import { signup, verifyEmail, forgetPassword, resetPassword, login, logout, getuserDetails } from '../controllers/auth.controller.js';

const router = express.Router();
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-user-details", verifyToken, getuserDetails);

export default router;

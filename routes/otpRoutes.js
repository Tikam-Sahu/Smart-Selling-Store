import express from 'express'
import { userOtpSendController } from '../controllers/otpController.js';
//router object 
const router = express.Router();

// //for otp varification 
router.post("/user/sendotp", userOtpSendController);

export default router;
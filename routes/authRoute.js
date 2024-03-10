import express from 'express'
import {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrderController,
    getAllOrdersController,
    orderStatusController,
    getAllUsersController,
    UpdateUsersDetailsByAdminController,
    DeleteUsersByAdminController
} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { userOtpSendController, userOtpVerifyController } from '../controllers/otpController.js';
//.env file import directly to avoid not found error
import dotenv from 'dotenv';

//confing dotenv file
dotenv.config();



//router object 
const router = express.Router();

//routing
//Register || Method POST
router.post("/register", registerController);

//LOGIN || POST 
router.post('/login', loginController);

//forgot password || post
router.post('/forgot-password', forgotPasswordController)


//text routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    // console.log("hit user/auth");
    res.status(200).send({ ok: true });
});

//protected route admin auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {

    res.status(200).send({ ok: true });
});

//update profile
router.put('/profile', requireSignIn, updateProfileController);

//orders
router.get('/orders', requireSignIn, getOrderController);

//all orders in admin dashboard
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put("/order-status/:orderId",
    requireSignIn,
    isAdmin,
    orderStatusController
);

//send otp
router.post('/otp', userOtpSendController);
router.post('/otp-verify', userOtpVerifyController);



//admin user management routes
router.get('/get-all-users-by-admin', requireSignIn, isAdmin, getAllUsersController);
router.put('/user-update-by-admin', requireSignIn, isAdmin, UpdateUsersDetailsByAdminController);
router.delete('/user-delete-by-admin', requireSignIn, isAdmin, DeleteUsersByAdminController);




export default router;
import nodemailer from 'nodemailer';
import userOtp from '../models/userOtp.js';
import userModel from "../models/userModel.js";
//.env file import directly to avoid not found error
import dotenv from 'dotenv';

//confing dotenv file
dotenv.config();

// Email config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// User send OTP
export const userOtpSendController = async (req, res) => {
    const { email } = req.body;
    const OTP = Math.floor(100000 + Math.random() * 900000);

    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" });
        return;
    } else {
        try {
            const existingUser = await userModel.findOne({ email });
            // Existing user
            if (existingUser) {
                return res.status(200).send({
                    success: false,
                    message: "Already Register please login",
                });
            } else {
                const existingEmail = await userOtp.findOne({ email });
                if (existingEmail) {
                    const updateData = await userOtp.findByIdAndUpdate(
                        { _id: existingEmail._id },
                        { otp: OTP },
                        { new: true }
                    );
                    await updateData.save();
                } else {
                    const saveOtpData = new userOtp({ email, otp: OTP });
                    await saveOtpData.save();
                }

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For OTP Validation",
                    text: `OTP:- ${OTP}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error:", error);
                        res.status(500).json({ error: "Email not sent" });
                    } else {
                        res.status(201).send({
                            success: true,
                            message: "Email sent ss Sucessfully",

                        })
                    }
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: false,
                message: 'Something went wrong',
                error
            })
        }
    }
};


export const userOtpVerifyController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validation
        if (!email || !otp) {
            return res.status(400).send({
                success: false,
                message: "Enter email and otp",
            });
        }

        // Check user
        const varify_email = await userOtp.findOne({ email });
        if (!varify_email) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }

        // Verify OTP
        if (varify_email.otp !== otp) {
            return res.status(400).send({
                success: false,
                message: "Invalid OTP",
            });
        }

        res.status(200).send({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in OTP Verification",
            error,
        });
    }
};

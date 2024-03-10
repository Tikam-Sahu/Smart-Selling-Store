import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken';
import orderModel from '../models/orderModel.js';
import nodemailer from "nodemailer";

//.env file import directly to avoid not found error
import dotenv from 'dotenv';

//confing dotenv file
dotenv.config();

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body

        //validation
        if (!name) {
            return res.send({ messaage: 'name is Required' })
        }
        if (!email) {
            return res.send({ messaage: 'email is Required' })
        }
        if (!password) {
            return res.send({ messaage: 'password is Required' })
        }
        if (!phone) {
            return res.send({ messaage: 'phone no. is Required' })
        }
        if (!address) {
            return res.send({ messaage: 'address is Required' })
        }
        if (!answer) {
            return res.send({ messaage: 'answer is Required' })
        }


        //check user
        const existingUser = await userModel.findOne({ email })
        //existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",

            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save()

        res.status(201).send({
            success: true,
            message: "User Register Sucessfully",
            //pass to user
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'hello Error in Registration',
            error
        })
    }
};


//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

//forgot password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({ message: "Email is required" })
        }
        if (!answer) {
            res.status(400).send({ message: "Question is required" })
        }

        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" })
        }
        //check 
        const user = await userModel.findOne({ email, answer })
        //validation 
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "wrong Email or Answer"
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            messae: "Password Reset Sucessfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess: false,
            messaage: "something went wrong",
            error
        })
    }
};

//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });

    }
};



//update Profile of user
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body
        const user = await userModel.findById(req.user._id)
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Password should be minimum 6 character long" })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true })
        res.status(200).send({
            success: true,
            message: "User Profile updated Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while user Update profile",
            error
        });
    };
};

//orders controller for user
export const getOrderController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            messaage: "Error While Getting Orders",
            error,
        })
    }
}


// all orders controller for admin panel
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};





//order status change and send email to user 

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await orderModel
            .findById(orderId)
            .populate("buyer")
            .populate("products", "name"); // Populate the products with only the name field

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const { email, name } = order.buyer;
        const productNames = order.products.map(product => product.name).join(", ");

        // Update order status
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        // Send email to user
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Order Status Update",
            html: `
                <h1>Email from Smart Selling Store</h1>
                <h2>Order Status Update</h2>
                <p>Hello ${name},</p>
                <p>Your order with the following products:</p>
                <ul>
                    <li>Product name : ${productNames}</li>
                </ul>
                <p>has been updated to: <strong>${status}</strong></p>
                <p>Thank you for shopping with us!</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ error: "Email not sent" });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Order status updated and email sent successfully",
                    updatedOrder,
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error while updating order status and sending email",
            error,
        });
    }
};









export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({}, '-password'); // Exclude the password field from the results
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
};



// Update Users Details By Admin Controller
export const UpdateUsersDetailsByAdminController = async (req, res) => {
    const { userId, updates } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: true, updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating user details' });
    }
};




// Delete Users Controller
export const DeleteUsersByAdminController = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};




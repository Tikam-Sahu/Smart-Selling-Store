import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import cancelOrderModel from "../models/cancelOrderModel.js";


//.env file import directly to avoid not found error
import dotenv from 'dotenv';

//confing dotenv file
dotenv.config();

//import for payment gateway
import braintree from "braintree";






//variable initialiaze for payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in crearing product",
        });
    }
};

//get all products
export const getProductController = async (req, res) => {
    try {
        //product show based on limit 
        const products = await productModel
            .find({})
            .populate('category')
            .select("-photo")
            .limit(1000)     //after changes 12 to 1000 for all product show in admin panel because no next option here 
            .sort({ createAt: -1 });
        res.status(200).send({
            total_procuct_count: products.length,
            sucess: true,
            message: "All products",
            products,

        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error: error.message
        })
    }
};



//get single product controller
export const getSingleProductController = async (req, res) => {
    //"-photo"  means photo not inclde in response
    //.populate('category')  means other detail expend and show in responce not only category
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate('category');
        res.status(200).send({
            success: true,
            message: "Single product fetched",
            product,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while gettting product",
            error,
        });
    }
};

//get product photo controller
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting photo",
            error,
        });
    }
};


//delete product controller
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "Product Deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        })
    }
};


//update product details controller
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};


// filters
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Filtering Products",
            error,
        });
    }
};


//product count for pagination
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "Error in product pagination",
            error,
            success: false
        })
    }
};


//product list display based on page number
export const productListController = async (req, res) => {
    try {
        const perPageProduct = 6
        const page_no = req.params.page ? req.params.page : 1
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page_no - 1) * perPageProduct)
            .limit(perPageProduct)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in per page product controller ",
            error
        })
    }
}



//search product controller

//The $regex operator in the code snippet you provided is used for performing a regular expression - based search in MongoDB.

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [
                //object create and i== case insensitive
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in product searching controller ",
            error,
        });
    }
};


//similar prodcut display controller
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find({
                category: cid,
                //ne = not include 
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while geting related product",
            error,
        });
    }
};


//prodcut display category wise controller


export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "error while geting category  product",
        });
    }
};









//payment gateway api controller for token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};




//payment controller for payment


//payment controller for payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.forEach((item) => {
            total += item.price * item.quantity;
        });

        const newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            async function (error, result) {
                if (result) {
                    try {
                        const order = new orderModel({
                            products: cart,
                            payment: result,
                            buyer: req.user._id,


                        });
                        await order.save();

                        // Fetch user's email
                        const user = await userModel.findById(req.user._id);
                        const userEmailAddress = user.email;
                        const userName = user.name;

                        // Create a transporter for sending emails
                        const transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: "tikambackup@gmail.com",
                                pass: "dqjrfynoqzqoymtz",
                            },
                        });

                        // Prepare order details
                        const orderDetails = cart.map((item) => {
                            return `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price}</td>
                                </tr>
                            `;
                        });

                        // Send email to user
                        const mailOptions = {
                            from: "tikambackup@gmail.com",
                            to: userEmailAddress,
                            subject: "Order Confirmation",
                            html: `
                            <h1> Email from Smart Selling Store </h1>
                        
                                   <h3> Hello ${userName} </h3>
                                <p>Thank you for shopping with us!</p>
                                <p>Your order details:</p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${orderDetails.join('')}
                                    </tbody>
                                </table>
                                <p>Total: $${total}</p>
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
                                });
                            }
                        });

                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ error: "An error occurred" });
                    }
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
};




//stock handle controller 

export const updateProductStockController = async (req, res) => {
    const { cart } = req.body;
    try {
        for (const item of cart) {
            const product = await productModel.findById(item._id);
            if (product) {
                product.quantity -= 1; // Decrease the quantity by one
                await product.save();
            }
        }
        res.json({ success: true, message: "Product quantities updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update product quantities" });
    }
};









// controllers/changeProductStatusController.js


export const changeProductStatusController = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'cancel';
        await order.save();

        res.status(200).json({ success: true, message: 'Order status changed to Cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while changing the order status', error: error.message });
    }
};




export const afterCancelUpdateProductStockController = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await orderModel.findById(orderId).populate('products');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Iterate through each product in the order
        for (const orderProduct of order.products) {
            const existingProduct = await productModel.findById(orderProduct._id);

            if (existingProduct) {
                // Calculate the quantity to restore based on the canceled order quantity
                const canceledQuantity = orderProduct.quantity;

                // Update the product's quantity
                existingProduct.quantity = existingProduct.quantity + 1;
                await existingProduct.save();
            }
        }

        res.status(200).json({ success: true, message: 'Product quantities updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while updating product quantities', error: error.message });
    }
};



// Controller for saving cancel order details
export const savePaymentDetailsController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { accountHolderName, accountNumber, ifscCode } = req.body;
        const { user_email } = req.body; // Get user email from request body

        // Find the order using orderId
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Find the user using user_email
        const user = await userModel.findOne({ email: user_email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new CancelOrder entry
        const cancelOrder = new cancelOrderModel({
            order: order._id, // Associate the cancel order with the specific order
            user: user._id,   // Associate the cancel order with the user
            accountHolderName,
            accountNumber,
            ifscCode
        });

        // Save the cancelOrder entry
        await cancelOrder.save();

        return res.status(201).json({ message: 'Cancel order details saved successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
};



//all cancel ordres 


export const getAllCancelOrders = async (req, res) => {
    try {
        const cancelOrders = await cancelOrderModel.find()
            .populate('order') // Populate the 'order' field with related order data
            .populate('user');  // Populate the 'user' field with related user data

        res.status(200).json(cancelOrders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};








// // Create a transporter for sending emails
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//     },
// });

export const cancelOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // const order = await cancelOrderModel
        //     .findOne({ order: orderId })
        //     .populate('user', 'email'); // Populate the 'user' field with only the 'email' field

        // if (!order) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Cancel Order not found',
        //     });
        // }

        // const { user } = order;

        // Update order status
        const updatedOrder = await cancelOrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        // Send email to user
        //     const mailOptions = {
        //         from: process.env.EMAIL,
        //         to: user.email,
        //         subject: 'cancel Order payment Status Update',
        //         html: `
        //             <h1>Email from Smart Selling Store</h1>
        //             <h2>Order cancel payment refund Status Update</h2>
        //             <p>Hello ${user.name},</p>
        //             <p>Your order with the following products has been updated to: <strong>${status}</strong></p>
        //             <p>Thank you for shopping with us!</p>
        //         `,
        //     };

        //     transporter.sendMail(mailOptions, (error, info) => {
        //         if (error) {
        //             console.log('Error:', error);
        //             res.status(500).json({ error: 'Email not sent' });
        //         } else {
        //             res.status(200).json({
        //                 success: true,
        //                 message: 'Order cancel payment status updated and email sent successfully',
        //                 updatedOrder,
        //             });
        //         }
        //     });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while updating order cancel payment status and sending email',
            error,
        });
    }

}

import mongoose from 'mongoose';

const cancelOrderSchema = new mongoose.Schema(
    {

        status: {
            type: String,
            default: "Hold",
            enum: ["Payment Refund", "Hold", "Reject"],
        },
        order: {
            type: mongoose.ObjectId,
            ref: 'Order',
            // required: true,
        },
        user: {
            type: mongoose.ObjectId,
            ref: 'users',
            // required: true,
        },
        accountHolderName: {
            type: String,
            // required: true,
        },
        accountNumber: {
            type: String,
            // required: true,
        },
        ifscCode: {
            type: String,
            // required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('cancelOrders', cancelOrderSchema);

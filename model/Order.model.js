import mongoose from "mongoose";
const Schema = mongoose.Schema;
// Generate random number for order
const randomTxt = Math.random(36).toString().substring(7).toLocaleUpperCase()
const randomNumber = Math.floor(1000 + Math.random()*90000)
const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems:[
        {
            type: Object,
            required: true,
        }
    ],
    shippingAddress: {
        type: Object,
        required: true
    },
    orderNumber: {
        type: String,
        required: true,
        default: randomTxt + randomNumber,
    },
    // for stripe payment
    paymentStatus: {
        type: String,
        required: true,
        default: 'Not paid'
    },
    paymentMethod: {
        type: String,
        default: "Not specified"
    },
    totalPrice: {
        type: Number,
        default: 0.0
    },
    currency: {
        type: String,
        default: "Not specified"
    },
    // for admin
    status: {
        type: String,
        default: "pending",
        enum: ['pending','processing','shipped','delivered']
    },
    deliveredAt: {
        type: Date
    }
},{timestamps: true})

// compiling to form model
const Order = mongoose.model('Order', orderSchema)
export default Order;
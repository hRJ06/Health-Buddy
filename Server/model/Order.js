const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    retailerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'retailer'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number
    },
    states: {
        type: String,
        enum: ["Placed", "Packed", "On the way", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Placed"
    },
    otp: {
        type: String
    },
    payment: {
        type: String,
        enum: ['Paid','Due'],
        default: 'Due'
    }
})
module.exports = mongoose.model('order',orderSchema);
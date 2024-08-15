const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["Dog", "Cat"],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved'],
            default: 'Pending'
        },
        tag: {
            type: String,
            enum: ['Food', 'Medicine', 'Toy', 'Clothing', 'Sanitary']
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'retailer'
        },
        images: [String],
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0
        },
        
    }
)
module.exports = mongoose.model('product',productSchema);
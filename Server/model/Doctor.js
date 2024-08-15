const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        },
        role: {
            type: String,
            enum: ["Doctor"]
        },
        type: {
            type: String,
            enum: ["Cat", "Dog"]
        },
        booked: {
            type: Boolean,
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Approved"]
        },
        licenseNo: {
            type: String,
            required: true,
        },
        resetToken: {
            type: String
        },
        resetPasswordTokenExpires: {
            type: Date
        },
        slots: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Slot'
            }
        ],
        appointments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'appointment'
            }
        ],
        review: {
            type: Number,
        },
        reviewCount: {
            type: Number
        }
    }
)
module.exports = mongoose.model('doctor',doctorSchema);
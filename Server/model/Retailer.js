const mongoose = require("mongoose");
const retailerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["Retailer"],
  },
  status: {
    type: String,
    enum: ["Approved", "Pending"],
    default: "Pending",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  gstIn: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetPasswordTokenExpires: {
    type: Date,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
});
module.exports = mongoose.model("retailer", retailerSchema);

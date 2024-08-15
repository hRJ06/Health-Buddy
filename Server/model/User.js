const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
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
    enum: ["User"],
  },
  resetToken: {
    type: String,
  },
  resetPasswordTokenExpires: {
    type: Date,
  },
  state: {
    type: String,
    required: true,
  },
  pets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pet",
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
  ],
});
module.exports = mongoose.model("user", userSchema);

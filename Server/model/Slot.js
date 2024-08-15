const mongoose = require("mongoose");
const slotSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  currentBookings: {
    type: Number,
    default: 0,
  },
  bookingsAccepted: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Slot", slotSchema);

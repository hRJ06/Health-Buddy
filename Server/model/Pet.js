const mongoose = require("mongoose");
const petSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Dog", "Cat"],
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  disability: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
    },
  ],
});
module.exports = mongoose.model("pet", petSchema);

const { default: mongoose } = require("mongoose");
const Pet = require("../model/Pet");
exports.getAppointments = async (req, res) => {
  try {
    const { petId } = req.body;
    const pet = await Pet.findById({ _id: new mongoose.Types.ObjectId(petId) })
      .populate({
        path: "appointments",
        populate: [
          { path: "doctor" },
          { path: "slot" },
        ],
      })
      .exec();
    return res.status(200).json({
      success: true,
      data: pet,
      message: "Fetched appointments for pet",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to get Appointments of Pet",
    });
  }
};

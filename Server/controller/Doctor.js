const Doctor = require("../model/Doctor");
const Retailer = require("../model/Retailer");
const User = require("../model/User");
const Pet = require("../model/Pet");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const mailSender = require("../util/mailSender");
const Appointment = require("../model/Appointment");
const Slot = require("../model/Slot");
const cron = require("node-cron");
const { default: mongoose } = require("mongoose");

function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) {
    options.quality = quality;
  }
  /* Preferred Option */
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      role,
      type,
      licenseNo,
      state,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNo ||
      !role ||
      !type ||
      !licenseNo
    ) {
      return res.status(403).json({
        success: false,
        message: "Please provide all required information",
      });
    }
    let existingUser = null;

    // Check if Retailer is already present
    existingUser = await Retailer.findOne({ email: email });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Retailer already exists",
      });
    }
    existingUser = await Retailer.findOne({ phoneNo: phoneNo });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Retailer already exists",
      });
    }

    // Check if User is already present
    existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
      });
    }
    existingUser = await User.findOne({ phoneNo: phoneNo });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
      });
    }

    // Check if Doctor is already present
    existingUser = await Doctor.findOne({ email: email });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Doctor already exists",
      });
    }
    existingUser = await Doctor.findOne({ phoneNo: phoneNo });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Doctor already exists",
      });
    }

    const file = req.files.imagefile;
    const supportedTypes = ["jpeg", "jpg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(401).json({
        success: false,
        message: "Invalid File Type",
      });
    }
    const response = await uploadFileToCloudinary(file, "Whisker Whisper");
    let hashedPassword = null;
    if (password) {
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Error in hashing password",
        });
      }
    }
    await Doctor.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      role,
      type,
      licenseNo,
      image: response.secure_url,
      state,
    });
    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error signing User",
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, phoneNo, password } = req.body;
    if ((!email || !phoneNo) && !password) {
      return res.status(403).json({
        success: false,
        message: "Please provide all details",
      });
    }
    let user = null;
    if (email) {
      user = await Doctor.findOne({ email: email });
    }
    if (phoneNo) {
      user = await Doctor.findOne({ phoneNo: phoneNo });
    }
    console.log(user);
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      id: user._id,
      role: user.role,
      licenseNo: user.licenseNo,
    };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;
      return res.status(200).json({
        success: true,
        token,
        user,
        message: "User Logged In Successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Password doesn't match",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Doctor.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user is registered with us for the mail ${email}`,
      });
    }
    const token = crypto.randomBytes(20).toString("hex");
    await Doctor.findOneAndUpdate(
      { email: email },
      {
        resetToken: token,
        resetPasswordTokenExpires: Date.now() + 3600000,
      }
    );
    const url = `http://localhost:3000/update-password/${token}`;
    await mailSender(
      email,
      "Password Reset Instruction",
      `Your Link for email verification is ${url}. Please click the link to reset your password`
    );
    return res.status(200).json({
      success: true,
      message: "Email to reset password was successfully sent",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error generating Reset Password Token",
    });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    const user = await Doctor.findOne({ resetToken: token });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No such user found",
      });
    }
    if (Date.now() > user.resetPasswordTokenExpires) {
      return res.status(403).json({
        success: false,
        message: "Token Expired",
      });
    }
    const updatedPassword = await bcrypt.hash(password, 10);
    await Doctor.findOneAndUpdate(
      { resetToken: token },
      { password: updatedPassword }
    );
    return res.status(200).json({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error in reset Password",
    });
  }
};
exports.getDoctorDetails = async (req, res) => {
  try {
    const { token } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Token missing",
      });
    }
    const doctor = await Doctor.findOne({
      _id: new mongoose.Types.ObjectId(decode.id),
    });
    return res.status(200).json({
      success: true,
      data: doctor,
      message: "Doctor details fetched successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error getting Doctor Details",
    });
  }
};
exports.getDoctors = async (req, res) => {
  try {
    const { petId } = req.body;
    const pet = await Pet.findById({ _id: new mongoose.Types.ObjectId(petId) });
    const type = pet.type;
    const doctor = await Doctor.find({ type: type, status: "Approved" });
    const averageReview = doctor.review / doctor.reviewCount;
    return res.status(200).json({
      success: true,
      data: doctor,
      averageReview,
      message: "Doctors fetched successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error getting Doctors",
    });
  }
};
exports.getAppointments = async (req, res) => {
  try {
    const { token } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: true,
        message: "Error verifying token",
      });
    }
    const appointments = await Appointment.find({
      doctor: new mongoose.Types.ObjectId(decode.id),
    })
      .sort({ date: -1 })
      .populate("user")
      .populate("slot")
      .exec();
    return res.status(200).json({
      success: true,
      data: appointments,
      message: "All appointments fetched",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: true,
      message: "Error getting Appointments",
    });
  }
};
exports.updateProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;
    const file = req.files.imagefile;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Token Missing",
      });
    }
    const supportedTypes = ["jpeg", "jpg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(401).json({
        success: false,
        message: "Invalid File Type",
      });
    }
    const response = await uploadFileToCloudinary(file, "Whisker Whisper");
    await Doctor.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(decode.id) },
      {
        image: response.secure_url,
      }
    );
    return res.status(200).json({
      success: true,
      message: "File successfully uploaded",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error ",
    });
  }
};
exports.addSlot = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Token is required",
      });
    }
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Error validating token",
      });
    }
    const {
      time,
      street,
      city,
      state,
      postalCode,
      bookingsAccepted,
      date,
      day,
    } = req.body;
    const slot = await Slot.create({
      time,
      street,
      city,
      state,
      postalCode,
      bookingsAccepted,
      date,
      day,
      doctor: decode.id,
    });
    await Doctor.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(decode.id) },
      {
        $push: {
          slots: slot._id,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Successfully Added Slot",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      messag: "Error adding Slot",
    });
  }
};
cron.schedule("* * * * *", async () => {
  try {
    const currentDate = new Date();
    console.log("Running cron job at:", currentDate);

    const slotsToUpdate = await Slot.find({
      day: currentDate.toLocaleDateString("en-US", { weekday: "long" }),
    });

    for (const slot of slotsToUpdate) {
      const [day, month, year] = slot.date.split("/");
      const slotDate = new Date(`${year}-${month}-${day}`);

      const timeDifference = currentDate - slotDate;
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (daysDifference >= 7) {
        slot.date = currentDate.toLocaleDateString("en-GB");
        slot.currentBookings = 0;
        await slot.save();
        console.log(`Updated slot: ${slot._id}`);
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

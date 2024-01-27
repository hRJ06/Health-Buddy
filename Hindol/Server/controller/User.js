const User = require("../model/User");
const Retailer = require("../model/Retailer");
const Doctor = require("../model/Doctor");
const Slot = require("../model/Slot");
const Pet = require("../model/Pet");
const jwt = require("jsonwebtoken");
const Appointment = require("../model/Appointment");
const bcrypt = require("bcrypt");
const mailSender = require("../util/mailSender");
const { default: mongoose } = require("mongoose");
const Product = require("../model/Product");
const AppointmentBookedUser = require("../template/AppointmentBookedUser");
const AppointmentBookedDoctor = require("../template/AppointmentBookedDoctor");
const Cart = require("../model/Cart");
const CompleteBooking = require("../template/CompleteBooking");
const cron = require("node-cron");
const CancelAppointment = require("../template/CancelAppointment");
const AppointmentResolved = require("../template/AppointmentResolved");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
require("dotenv").config();

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
    const { firstName, lastName, email, password, phoneNo, role } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNo || !role) {
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
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      role,
      image: `https://api.dicebear.com/6.x/initials/svg?seed=${
        firstName.charAt(0) + lastName.charAt(0)
      }`,
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
      user = await User.findOne({ email: email });
    }
    if (phoneNo) {
      user = await User.findOne({ phoneNo: phoneNo });
    }
    if (!user) {
      return res.statuss(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(user);
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      id: user._id,
      role: user.role,
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
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user is registered with us for the mail ${email}`,
      });
    }
    const token = crypto.randomBytes(20).toString("hex");
    await User.findOneAndUpdate(
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
    const user = await User.findOne({ resetToken: token });
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
    await User.findOneAndUpdate(
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
exports.addPet = async (req, res) => {
  try {
    const { type, breed, disability, token } = req.body;
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Please provide a token",
      });
    }
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }
    if (!type || !breed || !disability) {
      return res.status(404).json({
        success: false,
        message: "Send all the details of the pet",
      });
    }
    const pet = await Pet.create({ type, breed, disability, owner: decode.id });
    await User.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(decode.id) },
      {
        $push: {
          pets: pet._id,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Successfully your pet was registered",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error registering your pet",
    });
  }
};
exports.bookAppointment = async (req, res) => {
  try {
    const { token, doctorId, description, petId, slotId } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    let slot = await Slot.findById({
      _id: new mongoose.Types.ObjectId(slotId),
    });
    const currentDate = new Date();
    const slotStartTime = new Date(
      parseInt(slot.date.split("/")[2]),
      parseInt(slot.date.split("/")[1]) - 1,
      parseInt(slot.date.split("/")[0]),
      parseInt(slot.time.split(":")[0]),
      parseInt(slot.time.split(":")[1])
    );
    console.log(currentDate.toLocaleString(), slotStartTime.toLocaleString());
    if (currentDate >= slotStartTime) {
      return res.status(400).json({
        success: false,
        message: "Cannot book appointment for a past or ongoing time slot",
      });
    }
    const appointmentDate = new Date(
      parseInt(slot.date.split("/")[2]),
      parseInt(slot.date.split("/")[1]) - 1,
      parseInt(slot.date.split("/")[0]),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    );

    slot = await Slot.findByIdAndUpdate(
      new mongoose.Types.ObjectId(slotId),
      { $inc: { currentBookings: 1 } },
      { new: true }
    );

    const appointment = await Appointment.create({
      user: decode.id,
      doctor: doctorId,
      description,
      pet: petId,
      date: appointmentDate,
      slot: slot._id,
    });

    await Pet.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(petId) },
      {
        $push: {
          appointments: appointment._id,
        },
      }
    );

    const user = await User.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(decode.id) },
      {
        $push: {
          appointments: appointment._id,
        },
      }
    );

    const doctor = await Doctor.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(doctorId) },
      {
        $push: {
          appointments: appointment._id,
        },
        booked: true,
      }
    );

    await mailSender(
      user.email,
      "Appointment Booked",
      await AppointmentBookedUser(appointment, slot)
    );
    await mailSender(
      doctor.email,
      "New Appointment",
      await AppointmentBookedDoctor(appointment, user, slot)
    );

    return res.status(200).json({
      success: true,
      message: "Appointment added successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error adding appointment",
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "Approved" });
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error getting all products",
    });
  }
};
exports.getCategoryProducts = async (req, res) => {
  try {
    const { type } = req.body;
    const products = await Product.find({
      type: type,
      status: "Approved",
    });
    return res.status(200).json({
      success: true,
      message: `Products fetched successfully for Category ${type}`,
      data: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error getting category products",
    });
  }
};
exports.getNameProducts = async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const products = await Product.find({ status: "Approved" });
    const regexPattern = new RegExp(searchQuery, "i");
    const filteredProducts = products.filter((product) => {
      return regexPattern.test(product.name);
    });
    return res.status(200).json({
      success: true,
      message: "Products fetched",
      products: filteredProducts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error getting name products",
    });
  }
};
exports.filterProducts = async (req, res) => {
  try {
    const { searchQuery, type } = req.body;
    const products = await Product.find({ status: "Approved" });
    const regexPattern = new RegExp(searchQuery, "i");
    const filteredByName = products.filter((product) => {
      return regexPattern.test(product.name);
    });
    if (type) {
      const filteredProducts = filteredByName.filter((product) => {
        return product.type === type;
      });
      return res.status(200).json({
        success: true,
        message: "Products fetched",
        products: filteredProducts,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Successfully fetched products",
        products: filteredByName,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error filtering products",
    });
  }
};

exports.getAllPets = async (req, res) => {
  try {
    const { token } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }
    const user = await User.findById({
      _id: new mongoose.Types.ObjectId(decode.id),
    })
      .populate({
        path: "pets",
        populate: {
          path: "owner",
        },
      })
      .exec();

    const pets = user.pets;
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all pets",
      data: pets,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error getting all Pets",
    });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token missing",
      });
    }
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error decoding Token",
      });
    }
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(decode.id),
    });
    return res.status(200).json({
      success: true,
      data: user,
      message: "Successfully established User Details",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error getting user details",
    });
  }
};
exports.AddToCart = async (req, res) => {
  try {
    const { token, productId } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Token missing",
      });
    }
    const cartItem = await Cart.findOne({
      productId: productId,
      buyer: decode.id,
    });
    if (cartItem) {
      return res.status(200).json({
        success: false,
        message: "Already added to cart",
      });
    }
    const cart = await Cart.create({
      productId,
      buyer: decode.id,
      insertTime: Date.now(),
    });
    await User.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(decode.id) },
      {
        $push: {
          cartItems: cart._id,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Cart added successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error adding to cart",
    });
  }
};
exports.removeFromCart = async (req, res) => {
  try {
    const { token, productId } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error validating token",
      });
    }
    const cartItem = await Cart.findOne({
      productId: productId,
      buyer: decode.id,
    });
    await User.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(decode.id) },
      {
        $pull: {
          cartItems: cartItem._id,
        },
      }
    );
    await Cart.findByIdAndDelete({ _id: cartItem._id });
    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error removing from cart",
    });
  }
};
const checkExpiredCartItems = async (req, res) => {
  try {
    const currentTime = new Date();
    const twentyFourHoursAgo = new Date(
      currentTime.getTime() - 24 * 60 * 60 * 1000
    );
    const expiredCarts = await Cart.find({
      insertTime: { $lt: twentyFourHoursAgo },
      emailSent: false,
    });
    if (expiredCarts.length > 0) {
      expiredCarts.forEach(async (cart) => {
        const buyer = cart.buyer;
        const item = cart.productId;
        const product = await Product.findById({
          _id: new mongoose.Types.ObjectId(item),
        });
        const user = await User.findById({
          _id: new mongoose.Types.ObjectId(buyer),
        });
        await mailSender(
          user.email,
          "Your Item is Waiting in the Cart - Complete Your Booking Now!",
          await CompleteBooking(product, user)
        );
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error sending email",
    });
  }
};
cron.schedule("0 0 * * *", () => {
  checkExpiredCartItems();
  console.log("Email notification task executed.");
});
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
    await User.findByIdAndUpdate(
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
      message: "Error updating profile picture",
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
        success: false,
        message: "Error validating token",
      });
    }
    const user = await User.findById({
      _id: new mongoose.Types.ObjectId(decode.id),
    }).populate({ path: "appointments", populate: { path: "slot" } });
    const appointments = user.appointments;
    return res.status(200).json({
      success: true,
      message: "Doctor Appointments fetched successfully",
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error ",
    });
  }
};
exports.editUserDetails = async (req, res) => {
  try {
    const { token } = req.body;
    const { firstName, lastName, email, phoneNo } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error decoding token",
      });
    }
    const user = await User.findById({
      _id: new mongoose.Types.ObjectId(decode.id),
    });
    if (firstName) {
      user.firstName = firstName;
      user.save();
    }
    if (lastName) {
      user.lastName = lastName;
      user.save();
    }
    if (email) {
      user.email = email;
      user.save();
    }
    if (phoneNo) {
      user.phoneNo = phoneNo;
      user.save();
    }
    return res.status(200).json({
      success: true,
      message: "Successfully updated User Details",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error updating user details",
    });
  }
};
exports.cancelAppointment = async (req, res) => {
  try {
    const { token, appointmentId } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error validating token",
      });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(appointmentId) },
      {
        status: "Cancelled",
      }
    );
    const user = await User.findById({
      _id: new mongoose.Types.ObjectId(decode.id),
    });
    const slot = await Slot.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(appointment.slot) },
      {
        $inc: {
          currentBookings: -1,
        },
      }
    );
    await mailSender(
      user.email,
      "Appointment Cancelled",
      await CancelAppointment(appointment, user, slot)
    );
    return res.status(200).json({
      success: true,
      message: "Appointment successfully Cancelled",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error cancelling appointment",
    });
  }
};

const checkAppointments = async () => {
  const currentDate = new Date();
  try {
    const pendingAppointments = await Appointment.find({
      status: "Pending",
    })
      .populate("slot")
      .populate("user")
      .populate("doctor");

    pendingAppointments.forEach(async (appointment) => {
      const appointmentDateStr = appointment.slot.date;
      const [appointmentDay, appointmentMonth, appointmentYear] =
        appointmentDateStr.split("/");
      const appointmentDate = new Date(
        `${appointmentMonth}/${appointmentDay}/${appointmentYear}`
      );

      const appointmentTimeStr = appointment.slot.time;
      const [, endTime] = appointmentTimeStr.split("-");
      const [endHours, endMinutes] = endTime.split(":");

      appointmentDate.setHours(parseInt(endHours, 10));
      appointmentDate.setMinutes(parseInt(endMinutes, 10));

      console.log("Appointment End Date:", appointmentDate.toLocaleString());
      console.log("Current Date:", currentDate.toLocaleString());

      if (currentDate > appointmentDate) {
        appointment.status = "Approved";
        await appointment.save();
        await mailSender(
          appointment.user.email,
          "Appointment Resolved",
          await AppointmentResolved(
            appointment,
            appointment.user,
            appointment.doctor
          )
        );
      }
    });
  } catch (error) {
    console.error("Error checking appointments:", error);
  }
};

cron.schedule("* * * * *", () => {
  checkAppointments();
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

exports.getSlots = async (req, res) => {
  try {
    const { lat, lon, doctorId } = req.body;
    const slots = await Slot.find({
      doctor: new mongoose.Types.ObjectId(doctorId),
    })
      .populate("doctor")
      .exec();
    const geocodedSlots = await Promise.all(
      slots.map(async (slot) => {
        const city = slot.city;
        const postalcode = slot.postalCode;
        const address = `${slot.street}, ${city}-${postalcode}, ${slot.state}`;

        const options = {
          method: "GET",
          url: "https://trueway-geocoding.p.rapidapi.com/Geocode",
          params: {
            address: address,
            language: "en",
          },
          headers: {
            "X-RapidAPI-Key":
              "5226abccf0msha3b1b6c852bc943p13cb3bjsn6457c63a193f",
            "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
          },
        };
        try {
          const geocodingResponse = await axios.request(options);
          const { lat: slotLat, lng: slotLng } =
            geocodingResponse.data.results[0].location;
          const distance = calculateDistance(lat, lon, slotLat, slotLng);
          return { slot, distance };
        } catch (error) {
          console.error("Geocoding Error ", error);
          return null;
        }
      })
    );
    const validGeocodedSlots = geocodedSlots.filter((slot) => slot !== null);
    if (validGeocodedSlots.length === 0) {
      return res.status(200).json({
        success: true,
        data: slots,
      });
    }
    validGeocodedSlots.sort((a, b) => a.distance - b.distance);
    const sortedSlots = validGeocodedSlots.map((slot) => slot.slot);

    return res.status(200).json({
      success: true,
      data: sortedSlots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to get slots",
    });
  }
};
exports.addReview = async (req, res) => {
  try {
    const { token, appointmentId, review } = req.body;
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error decoding token",
      });
    }
    const appointment = await Appointment.findById({
      _id: new mongoose.Types.ObjectId(appointmentId),
    })
      .populate("doctor")
      .exec();
    await Doctor.findByIdAndUpdate(
      { _id: appointment.doctor._id },
      {
        $inc: {
          review: review,
          reviewCount: 1,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Successfully added review",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error adding review",
    });
  }
};
exports.getCartItems = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Token missing",
      });
    }
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error validating token",
      });
    }
    const user = await User.findById({ _id: decode.id })
      .populate({
        path: "cartItems",
        populate: {
          path: "productId",
        },
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "Successfully fetched Cart Items",
      items: user.cartItems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error Getting Cart Details",
    });
  }
};
exports.getOrders = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Token missing",
      });
    }
    let decode = null;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error validating token",
      });
    }
    const user = await User.findById({ _id: decode.id })
      .populate({
        path: "orders",
        populate: [{ path: "productId" }, { path: "retailerId" }],
      })
      .exec();

    return res.status(200).json({
      success: true,
      orders: user.orders,
      message: "Getting Order Details",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error Getting Order Details",
    });
  }
};

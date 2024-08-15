const express = require("express");
const {
  signup,
  login,
  resetPasswordToken,
  resetPassword,
  getDoctorDetails,
  getDoctors,
  getAppointments,
  updateProfilePicture,
  addSlot,
} = require("../controller/Doctor");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/updateProfilePicture", updateProfilePicture);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/getDoctorDetails", getDoctorDetails);
router.post("/resetPassword", resetPassword);
router.post("/addSlot", addSlot);
router.post("/getAppointments", getAppointments);
router.post("/getDoctors", getDoctors);
module.exports = router;

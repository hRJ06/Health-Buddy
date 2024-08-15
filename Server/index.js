const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const database = require("./config/database");
const PORT = process.env.PORT || 4000;

const userRoutes = require("./routes/User");
const doctorRoutes = require("./routes/Doctor");
const retailersRoutes = require("./routes/Retailer");
const orderRoutes = require("./routes/Order");
const petRoutes = require("./routes/Pet");
const cloudinary = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/retailer", retailersRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/pet", petRoutes);
database.connect();
cloudinary.cloudinaryConnect();
app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});

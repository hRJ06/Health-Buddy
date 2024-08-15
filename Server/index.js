const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const database = require("./config/database");
const userRoutes = require("./routes/User");
const doctorRoutes = require("./routes/Doctor");
const retailersRoutes = require("./routes/Retailer");
const orderRoutes = require("./routes/Order");
const petRoutes = require("./routes/Pet");
const cloudinary = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

app.use(express.json());
/* CORS SETUP */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

/* FILE UPLOAD SETUP */
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

/* API ROUTES */
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/retailer", retailersRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/pet", petRoutes);

/* DB CONNECT */
database.connect();

/* CLOUDINARY CONNECT */
cloudinary.cloudinaryConnect();

/* LISTEN SERVER */
app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});

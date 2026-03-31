const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/eventDB")
  .then(() => console.log("DB connected"));

app.use("/booking", bookingRoutes);
app.use("/payment", paymentRoutes);
app.use("/ticket", ticketRoutes);

app.listen(5000, () => console.log("Server running on 5000"));
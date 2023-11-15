const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require('./Routes/userRoutes,js')

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/users',userRoute)

app.listen(PORT, (req, res) => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((error) => {
    console.log("DB CONNECTION FAILED :", error.message);
  });

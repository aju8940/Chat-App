const express = require("express");
const cors = require("cors");
const connectDB = require("./Db/db");
const userRoute = require('./Routes/userRoutes')

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/users',userRoute)

app.get("/", (req, res) => res.json("Welcome to chat app"));

app.listen(PORT, (req, res) => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

connectDB()
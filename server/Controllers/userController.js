const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");

// JWT TOKEN 
const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};


// REGISTER USER 
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exist" });

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ error: "Email must be valid email" });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ error: "Enter Strong Password" });

    user = userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


// LOGIN USER 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "All fields are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ error: "Enter valid email" });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ error: "Enter valid Password" });

    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "User doesnt exist" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ error: "Invalid password" });

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


// GET USERS 
const getUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
};

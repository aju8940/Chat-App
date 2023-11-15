const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY
    return jwtkey.sign({_id})
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await userModel.findOne({ email });

  if (user) return res.status(400).json("User already exist");

  if (!name || !email || !password)
    return res.status(400).json("All fields are required");

  if (!validator.isEmail(email))
    return res.status(400).json("Email must be valid email");

  if (!validator.isStrongPassword(password))
    return res.status(400).json("Enter Strong Password");

  user = userModel({ name, email, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
};

module.exports = {
  registerUser,
};

const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();

router
  .route("/register")
  .get((req, res) => res.json("Register user page"))
  .post(userController.registerUser);

router
  .route("/login")
  .get((req, res) => res.json("Login page"))
  .post(userController.loginUser);

  router.route('/').get(userController.getUsers)

module.exports = router;

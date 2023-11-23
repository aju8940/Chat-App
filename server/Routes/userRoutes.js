const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();

router
  .route("/register")
  .post(userController.registerUser);

router
  .route("/login")
  .post(userController.loginUser);

  router.route('/').get(userController.getUsers)

module.exports = router;

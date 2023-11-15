const express = require("express");
const {registerUser} = require('../Controllers/userController')

const router = express.Router();

router.route('/').get(registerUser)

module.exports = router;
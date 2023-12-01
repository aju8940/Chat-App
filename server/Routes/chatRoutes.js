const express = require("express");
const router = express.Router();
const chatController = require("../Controllers/chatController");

router.route("/").post(chatController.createChat);

router.route("/find/:firstId/:secondId").get(chatController.findChat);

router.route("/:userId").get(chatController.findUserChats);

module.exports = router;

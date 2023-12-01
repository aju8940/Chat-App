const chatModel = require("../Models/chatModels");

// CREATE CHAT
const createChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });
    const response = await newChat.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// FIND USER CHATS
const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userChats = await chatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(userChats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// FIND CHAT
const findChat = async (req, res) => {
  const firstId = req.params.firstId;
  const secondId = req.params.secondIdId;

  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


module.exports = {
    createChat,
    findChat,
    findUserChats
}
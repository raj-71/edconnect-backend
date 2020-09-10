const { Chat } = require("../../models/chat");
const express = require("express");
const router = express.Router();
const userAuth = require("../../middleware/userAuth");

router.get("/", userAuth, async (req, res) => {
  let messages = await Chat.find({ room: req.user.pairId });
  return res.send(messages);
});

module.exports = router;

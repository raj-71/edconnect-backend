const Joi = require("joi");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: new Date(Date.now()),
    required: false,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

function validateChat(chat) {
  const schema = {
    userId: Joi.string().required(),
    room: Joi.string().required(),
    message: Joi.string().required(),
    time: Joi.date(),
  };

  return Joi.validate(chat, schema);
}

exports.Chat = Chat;
exports.validate = validateChat;

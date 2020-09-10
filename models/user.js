const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  pairId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
  },
  role: {
    type: String,
    required: true,
  },
  userDetails: {
    type: String,
  },
  plans: {
    type: Array,
  },
  reports: {
    type: Array,
  },
  chats: {
    type: Array,
  },
  name: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      pairId: this.pairId,
      role: this.role,
    },
    config.get("userPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser({ username, password }) {
  const schema = {
    username: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate({ username, password }, schema);
}

exports.User = User;
exports.validate = validateUser;

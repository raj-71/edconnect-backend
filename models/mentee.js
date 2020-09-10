const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  pairId: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Mentee = mongoose.model("Mentee", userSchema);

function validateMentee(user) {
  const schema = {
    username: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

exports.Mentee = Mentee;
exports.validate = validateMentee;

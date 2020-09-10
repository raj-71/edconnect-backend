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
  pairs: {
    type: Array,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      isAdmin: this.isAdmin,
    },
    config.get("adminPrivateKey")
  );
  return token;
};

const Admin = mongoose.model("Admin", userSchema);

function validateAdmin(user) {
  const schema = {
    username: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

exports.Admin = Admin;
exports.validate = validateAdmin;

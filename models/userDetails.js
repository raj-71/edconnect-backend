const Joi = require("joi");
const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  profileUrl: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  class: {
    type: Number,
    required: false,
  },
  dob: {
    type: Date,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  achievements: {
    type: String,
    required: false,
  },
  qualifications: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  profileUrl: {
    type: String,
    required: false,
  },
});

const UserDetail = mongoose.model("UserDetails", userDetailsSchema);

function validateUserDetail(userDetails) {
  const schema = {
    fullName: Joi.string().required(),
    gender: Joi.string().required(),
    phoneNo: Joi.number().required(),
    class: Joi.string(),
    dob: Joi.date().required(),
    streetAddress: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    pinCode: Joi.number().required(),
    achievements: Joi.string(),
    qualifications: Joi.string(),
    email: Joi.string(),
    profileUrl: Joi.string(),
    class: Joi.number(),
  };

  return Joi.validate(userDetails, schema);
}

exports.UserDetail = UserDetail;
exports.validate = validateUserDetail;

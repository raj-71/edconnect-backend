const Joi = require("joi");
const mongoose = require("mongoose");

const myPlannerSchema = new mongoose.Schema({
  pairId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  description: {
    type: String,
    required: true,
  },
});

function validateMyPlanner(plan) {
  const schema = {
    date: Joi.string().required(),
    description: Joi.string().required(),
  };

  return Joi.validate(plan, schema);
}

const MyPlanner = mongoose.model("MyPlanner", myPlannerSchema);

exports.MyPlanner = MyPlanner;
exports.validate = validateMyPlanner;

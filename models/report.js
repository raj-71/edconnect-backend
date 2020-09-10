const Joi = require("joi");
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Report = mongoose.model("Report", reportSchema);

function validateReport(report) {
  const schema = {
    description: Joi.string().required(),
    date: Joi.date().required(),
  };

  return Joi.validate(report, schema);
}

exports.Report = Report;
exports.validate = validateReport;

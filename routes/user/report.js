const express = require("express");
const userAuth = require("../../middleware/userAuth");
const router = express.Router();
const { Report, validate } = require("../../models/report");
const { User } = require("../../models/user");
const winston = require("winston");

router.get("/", userAuth, async (req, res) => {
  try {
    let reports = await Report.find({ userId: req.user._id });
    if (reports) {
      return res.send(reports);
    }
    return res.send("Record Not found");
  } catch (error) {
    winston.error("GET report", error);
  }
});

router.post("/", userAuth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let newReport = new Report({
    userId: req.user._id,
    date: req.body.date,
    description: req.body.description,
  });
  newReport = await newReport.save();
  let user = await User.findById(req.user._id).select("-password");
  user.reports.push(newReport._id);
  user.save();
  res.send("Saved Successfully");
});

module.exports = router;

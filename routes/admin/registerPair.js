const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../../models/user");
const { Admin } = require("../../models/admin");
const express = require("express");
const router = express.Router();
const { v1: uuidv1 } = require("uuid");
const adminAuth = require("../../middleware/adminAuth");

router.post("/", adminAuth, async (req, res) => {
  const { errorMentor } = validate({
    username: req.body.mentorUser,
    password: req.body.mentorPass,
  });
  const { errorMentee } = validate({
    username: req.body.menteeUser,
    password: req.body.menteePass,
  });
  if (errorMentor) {
    return res.status(400).send(errorMentor.details[0].message);
  }
  if (errorMentee) {
    return res.status(400).send(errorMentee.details[0].message);
  }

  if (req.body.mentorUser === req.body.menteeUser) {
    return res.status(404).send("Mentor Mentee username cannot be same.");
  }

  let pairId = uuidv1();

  let mentor = await User.findOne({ username: req.body.mentorUser });
  if (mentor) {
    return res.status(404).send("Mentor Username not available");
  }
  mentor = new User({
    username: req.body.mentorUser,
    password: req.body.mentorPass,
  });
  mentor["pairId"] = pairId;
  mentor["role"] = "mentor";
  const saltMentor = await bcrypt.genSalt(10);
  mentor.password = await bcrypt.hash(req.body.mentorPass, saltMentor);

  let mentee = await User.findOne({ username: req.body.menteeUser });
  if (mentee) {
    return res.status(404).send("Mentee Username not available");
  }
  mentee = new User({
    username: req.body.menteeUser,
    password: req.body.menteePass,
  });
  mentee["pairId"] = pairId;
  mentee["role"] = "mentee";
  const saltMentee = await bcrypt.genSalt(10);
  mentee.password = await bcrypt.hash(req.body.menteePass, saltMentee);

  await mentor.save();
  await mentee.save();

  let pair = {
    mentor: mentor,
    mentee: mentee,
  };

  if (pair) {
    const user = await Admin.findById(req.user._id).select("-password");
    user.pairs.push(pairId);
    await user.save();
    return res.send("Pair Registered Successfully");
  } else {
    return res.status(500).send("Could not register the pair.");
  }
});

module.exports = router;

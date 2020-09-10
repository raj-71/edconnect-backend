const bcrypt = require("bcrypt");
const _ = require("lodash");
const { Admin, validate } = require("../../models/admin");
const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");

router.post("/", adminAuth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({ username: req.body.username });
  if (user) return res.status(400).send("Admin already registered.");

  user = new Admin(_.pick(req.body, ["username", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.send("New admin successfully registered");
});

module.exports = router;

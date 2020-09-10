const _ = require("lodash");
const { UserDetail, validate } = require("../../models/userDetails");
const { User } = require("../../models/user");
const express = require("express");
const userAuth = require("../../middleware/userAuth");
const router = express.Router();
const upload = require("../../middleware/image-upload");
const winston = require("winston");

const singleUpload = upload.single("image");

router.get("/", userAuth, async (req, res) => {
  const userDetails = await UserDetail.findOne({ userId: req.user._id });
  if (userDetails) return res.send(userDetails);
  return res.status(404).send("Details not found");
});

router.get("/pair", userAuth, async (req, res) => {
  const id = req.user.pairId;
  let role = "mentor";
  if (req.user.role === "mentor") role = "mentee";
  let userDetails = await User.findOne({
    pairId: id,
    role: role,
  }).select("userDetails");

  userDetails = await UserDetail.findById(userDetails.userDetails);
  if (userDetails) return res.send(userDetails);
  res.status(404).send("Not found");
});

router.post("/", userAuth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let userDetails = _.pick(req.body, [
      "fullName",
      "gender",
      "phoneNo",
      "class",
      "dob",
      "streetAddress",
      "city",
      "state",
      "country",
      "achievements",
      "qualifications",
      "email",
      "profileUrl",
      "pinCode",
      "class",
    ]);

    let searchDetails = await UserDetail.findOne({ userId: req.user._id });

    if (searchDetails) {
      const save = await searchDetails.updateOne(userDetails);
      if (!save) return res.status(500).send("Could not save details");
      return res.status(200).send(save);
    }
    userDetails = new UserDetail(userDetails);
    userDetails["userId"] = req.user._id;
    const save = await userDetails.save();
    let user = await User.findById(req.user._id).select("-password");
    user.name = req.body.fullName;
    user.userDetails = save._id;
    user.save();
    if (!save) return res.status(500).send("Could not save the details");
    return res.status(200).send("Details saved successfully");
  } catch (error) {
    winston.error("POST userdetails", error);
  }
});

router.post("/profile", userAuth, async (req, res) => {
  singleUpload(req, res, function (err) {
    if (err) {
      winston.error("Profile Image Upload Error : ", err);
      return res.json({ err: err });
    } else {
      return res.json({ imageUrl: req.file.location });
    }
  });
});

module.exports = router;

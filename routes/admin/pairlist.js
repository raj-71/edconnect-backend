const { Admin } = require("../../models/admin");
const { User } = require("../../models/user");
const { UserDetail } = require("../../models/userDetails");
const { Report } = require("../../models/report");
const { MyPlanner } = require("../../models/myPlanner");
const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");
const { Chat } = require("../../models/chat");

router.get("/", adminAuth, async (req, res) => {
  let pairs = await Admin.findById(req.user._id).select("pairs");
  pairs = pairs.pairs;
  let pair,
    pairsList = [];
  for (i = 0; i < pairs.length; i++) {
    pair = await User.find({ pairId: pairs[i] }).select("-password -__v");
    pair = Object.assign({}, pair);
    pairsList.push(pair);
  }
  if (pairsList) return res.status(200).send(pairsList);
  return res.status(404).send("not found");
});

router.get("/:pairId", adminAuth, async (req, res) => {
  let { pairId } = req.params;
  let details = await User.find({ pairId: pairId }).select("-password");
  if (details) res.send(details);
});

router.get("/userdetails/:mentorId/:menteeId", adminAuth, async (req, res) => {
  let { mentorId, menteeId } = req.params;
  let mentorDetails = await UserDetail.findById(mentorId);
  let menteeDetails = await UserDetail.findById(menteeId);
  if (mentorDetails && menteeDetails) {
    return res.send({ mentorDetails, menteeDetails });
  }
  return res.send("No data found");
});

router.get("/reports/:mentorId/:menteeId", adminAuth, async (req, res) => {
  let { mentorId, menteeId } = req.params;

  let mentorAllReports = await Report.find({ userId: mentorId });
  let menteeAllReports = await Report.find({ userId: menteeId });

  if (mentorAllReports && menteeAllReports) {
    return res.send({ mentorAllReports, menteeAllReports });
  }
  return res.send("No data found");
});

router.get("/plans/:pairId", adminAuth, async (req, res) => {
  let { pairId } = req.params;

  let plans = await MyPlanner.find({ pairId: pairId });
  if (plans) {
    plans = plans.filter((item) => {
      return new Date(item.date) > new Date();
    });
    if (plans.length > 0) {
      return res.send(plans);
    }
    return res.status(404).send(null);
  }
  return res.status(404).send("No data found");
});

router.get("/chat/:pairId", adminAuth, async (req, res) => {
  let { pairId } = req.params;
  let chats = await Chat.find({ room: pairId });
  if (chats) {
    return res.send(chats);
  }
});

module.exports = router;

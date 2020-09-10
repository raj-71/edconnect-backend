const express = require("express");
const userAuth = require("../../middleware/userAuth");
const router = express.Router();
const { MyPlanner, validate } = require("../../models/myPlanner");
const { User } = require("../../models/user");
const winston = require("winston");

router.get("/", userAuth, async (req, res) => {
  try {
    let plans = await MyPlanner.find({ pairId: req.user.pairId });
    if (plans) {
      plans = plans.filter((item) => {
        return new Date(item.date) > new Date();
      });
      return res.status(200).send(plans);
    }
    return res.status(404).send("Record Not found");
  } catch (error) {
    winston.error("Error in GET MyPlanner", error);
  }
});

router.post("/", userAuth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newPlan = new MyPlanner({
    pairId: req.user.pairId,
    date: req.body.date,
    description: req.body.description,
  });
  newPlan = await newPlan.save();
  let user = await User.findById(req.user._id).select("-password");
  user.plans.push(newPlan._id);
  user.save();
  res.send("Saved Successfully");
});

router.delete("/", userAuth, async (req, res) => {
  console.log(req.body);
  let deletePlan = await MyPlanner.findById(req.body.id);
  deletePlan = deletePlan.deleteOne();
  if (!deletePlan) return res.status(404).send("Could not delete plan");
  return res.status(200).send("Deleted plan successfully");
});

router.delete("/:id", userAuth, async (req, res) => {
  const { id } = req.params;
  let deletePlan = await MyPlanner.findById(id);
  deletePlan = deletePlan.deleteOne();
  if (!deletePlan) return res.status(404).send("Could not delete plan");
  return res.status(200).send("Deleted plan successfully");
});

module.exports = router;

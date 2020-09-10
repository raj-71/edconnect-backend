const express = require("express");
const error = require("../middleware/error");

const adminLogin = require("../routes/admin/login");
const pairs = require("../routes/admin/pairlist");
const adminRegister = require("../routes/admin/register");
const adminRegisterPair = require("../routes/admin/registerPair");
const userLogin = require("../routes/user/login");
const myplanner = require("../routes/user/myPlanner");
const report = require("../routes/user/report");
const messages = require("../routes/user/sendChats");
const userDetail = require("../routes/user/userDetails");

module.exports = function (app) {
  app.use(express.json());
  app.use("/admin/login", adminLogin);
  app.use("/admin/register", adminRegister);
  app.use("/admin/registerpair", adminRegisterPair);
  app.use("/admin/pairs", pairs);
  app.use("/user/login", userLogin);
  app.use("/user/userdetails", userDetail);
  app.use("/user/myplanner", myplanner);
  app.use("/user/report", report);
  app.use("/user/messages", messages);
  app.use(error);
};

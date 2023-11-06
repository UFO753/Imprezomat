const express = require("express");
const router = express.Router();
const userModel = require("../models/usermodel");
const passport = require("passport");

router.get("/", function (req, res) {
  res.render("pages/index");
});

router.get("/news", function (req, res) {
  res.render("pages/news");
});
router.get("/calendar", function (req, res) {
  res.render("pages/calendar");
});
router.get("/login", function (req, res) {
  res.render("pages/login");
});

router.get("/register", function (req, res) {
  res.render("pages/register");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/", isAuthenticated, (req, res) => {
  res.render("pages/index");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;

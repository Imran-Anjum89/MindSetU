const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const wrapAsync = require("../../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../../middleware.js");

const userController = require("../../controllers/users.js");
const { render } = require("ejs");

router.route("/signup")
    .get(userController.renderSignupForm) // Render signup form
    .post(wrapAsync(userController.signup)); // Handle signup form submission


router.route("/login")
    .get(userController.renderLoginForm) // Render login form
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
        }),
        userController.login
    ); // Handle login form submission


router.get("/logout", userController.logout);

module.exports = router;

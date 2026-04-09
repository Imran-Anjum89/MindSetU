const express = require("express");
const router = express.Router();
const wrapAsync = require("../../utils/wrapAsync");
const authController = require("../../controllers/auth_api");
const multer = require("multer");
const { storage } = require("../../cloudConfig");
const upload = multer({ storage });

router.post("/signup/student", wrapAsync(authController.signupStudent));

// For admin, we upload an image (college image)
router.post("/signup/admin", upload.single("image"), wrapAsync(authController.signupAdmin));

router.put("/update", wrapAsync(authController.updateUser));

router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Check auth status
router.get("/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false, user: null });
    }
});

module.exports = router;

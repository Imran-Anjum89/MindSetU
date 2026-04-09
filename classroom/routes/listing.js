const express = require("express");
const router = express.Router();
const wrapAsync = require("../../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../../middleware.js");
const listingController = require("../../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
  .get(wrapAsync(listingController.index)) // index route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listingController.showListing)) // show route (handles appointments too)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;

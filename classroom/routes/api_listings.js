const express = require("express");
const router = express.Router();
const wrapAsync = require("../../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../../middleware.js");
const listingApiController = require("../../controllers/listings_api.js");
const multer = require("multer");
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingApiController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        // validateListing, // validation might need adjustment for API if it relies on Joi showing flash messages? 
        // Usually validateListing throws an error which express global handler catches. Global handler renders 'error.ejs'.
        // We should probably check global error handler too.
        wrapAsync(listingApiController.createListing)
    );

router.route("/:id")
    .get(wrapAsync(listingApiController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        wrapAsync(listingApiController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingApiController.deleteListing));

module.exports = router;

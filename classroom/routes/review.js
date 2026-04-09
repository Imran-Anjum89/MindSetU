const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../../utils/wrapAsync.js");
const ExpressError = require("../../utils/ExpressError.js");
const Review = require("../../models/review.js");
const Listing = require("../../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../../middleware.js");

const userController = require("../../controllers/reviews.js");


//Post Review-Route 
router.post("/", isLoggedIn, validateReview, wrapAsync(userController.createReview));

//Delete Review-Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(userController.deleteReview));

module.exports = router;

const express = require('express');
const router = express.Router({mergeParams : true});   //mergeParams to send the id to this file
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//REVIEWS ROUTE
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const reviewController = require("../controllers/reviews.js");
const {
  validateReview,
  inLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// validate review middleware

/// Review  Create
router.post(
  "/",
  inLoggedIn,
  validateReview,
  WrapAsync(reviewController.createReview)
);

// delete review route
router.delete(
  "/:reviewId",
  inLoggedIn,
  isReviewAuthor,
  WrapAsync(reviewController.destoryReview)
);
module.exports = router;

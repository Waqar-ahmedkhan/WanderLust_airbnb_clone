const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const { inLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(WrapAsync(listingController.index))
  .post(
    inLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    WrapAsync(listingController.createListings)
  );

/// new route
router.get("/new", inLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(WrapAsync(listingController.showListings))
  .put(
    inLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    WrapAsync(listingController.updateListings)
  )
  .delete(inLoggedIn, isOwner, WrapAsync(listingController.destroyListings));

/// Edit route
router.get(
  "/:id/Edit",
  inLoggedIn,
  isOwner,
  WrapAsync(listingController.renderEditForm)
);

module.exports = router;

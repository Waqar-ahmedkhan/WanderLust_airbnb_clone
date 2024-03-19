const Listing = require("../models/listing");
// const OpenCageGeocode = require("opencage-api-client");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);

  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_220");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    req.flash("success", "   Listing Updated!");
    res.redirect(`/listings/${id}`);
  }
};
module.exports.destroyListings = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

/////// for map coding
// try {
//   // Geocode the location using OpenCage API
//   const { location } = req.body.listing;
//   const response = await OpenCageGeocode.geocode({
//     q: location,
//     key: "8dc84a0105f6457c8bf5b9a83d79febf", // Replace with your OpenCage API key
//   });

//   // Check if the geocoding was successful
//   if (response && response.status.code === 200) {
//     // Choose the result with the highest confidence
//     const chosenResult = response.results.reduce((prev, current) =>
//       prev.confidence > current.confidence ? prev : current
//     );

//     newListing.geometry = {
//       type: "Point",
//       coordinates: [chosenResult.geometry.lng, chosenResult.geometry.lat],
//     };

//     // Save the new listing with coordinates to the database
//     await newListing.save();

//     // Log success and redirect
//     console.log(
//       "New listing created with coordinates:",
//       newListing.geometry.coordinates
//     );
// req.flash("success", "New listing created!");
// res.redirect("/listings");
//   } else {
//     console.error("Error in geocoding:", response.status.message);
//     // Handle the error as needed
//     req.flash("error", "Error creating listing");
//     res.redirect("/listings");
//   }
// } catch (error) {
//   console.error("Error creating listing:", error.message);
//   req.flash("error", "Error creating listing");
//   res.redirect("/listings");
// }

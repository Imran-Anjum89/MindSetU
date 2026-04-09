const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};


module.exports.createListing = async (req, res) => {
  try {
    const { path: url, filename } = req.file; // destructure upload
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();
    req.flash("success", "Your Organization Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("createListing error:", err);
    req.flash("error", "Failed to create organization");
    res.redirect("/listings");
  }
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Organization you requested for does not exist!");
    return res.redirect("/listings");
  }

  // generate thumbnail URL
  let originalImageUrl = listing.image.url.replace(
    "/upload",
    "/upload/w_250,c_fill"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};
// Add this to your listings controller (show route)
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner")
    .populate({
      path: "appointments",
      populate: {
        path: "student",
        select: "_id username email"
      }
    });

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    const { path: url, filename } = req.file;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Your Organization is Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);

  if (deletedListing) {
    req.flash("success", "Organization Deleted");
  } else {
    req.flash("error", "Organization not found");
  }

  res.redirect("/listings");
};

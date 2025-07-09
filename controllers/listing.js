const listing = require("../model/listing.js");

module.exports.index = async (req, res) => {
  const allListing = await listing.find({});
  console.log("🎯 All listings:", allListing);
  res.render("listings/index", { allListing });
};

module.exports.renderNewForm = (req, res) => {

  res.render("listings/new.ejs");
};

module.exports.displayListings = async (req, res) => {
  const category = req.params.category;
  const trendingListings = await listing.find({ category: category });

  res.render('listings/icon.ejs', { allListing: trendingListings });
};

module.exports.searchListing = async (req, res) => {
  const location = req.params.location;
  const allListing = await listing.find({ location: location });

  res.render('listings/icon.ejs', { allListing });
};


module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let details = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");

  if (!details) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { details });
};



module.exports.createListing = async (req, res, next) => {
  try {
    const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
    const mapToken = process.env.MAP_TOKEN;

    const geocodingClient = mbxGeocoding({ accessToken: mapToken });

    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Assign geometry only if valid
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);




    req.flash("success", "New listing is created");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create a new listing. Please try again.");
    res.redirect("/listings/new");
  }
};


module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  let details = await listing.findById(id);
  if (!details) {
    req.flash("errormsg", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  originalImageUrl = details.image.url;
  originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { details, originalImageUrl });
};

module.exports.updateListing = async (req, res, next) => {
  if (!req.body.listing) {
    throw new expressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }

  req.flash("success", "Listing is updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};




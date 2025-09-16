const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //
const { listingSchema } = require("../Schema.js"); //
const ExpressError = require("../utils/ExpressError.js"); //
const Listing = require('../models/listing.js'); //

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Index Route - List all listings
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

// new route and create route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created")
    req.flash("fail", "Listing Failed")
    res.redirect("/listings");
}));


// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings")
    } else {
        res.render("listings/show.ejs", { listing });
    }
}));

// edit route 
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("update", "Listing is updated");
    res.redirect(`/listings/${id}`); //
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports = router;
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //

const Listing = require('../models/listing.js'); //
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");


// Index Route - List all listings
router.get("/", wrapAsync(listingController.index));

// new route and create route
router.get("/new", isLoggedIn, listingController.renderNewForm );

router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createRoute));


// show route
router.get("/:id", wrapAsync(listingController.showListing));

// edit/update route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editPageRender));

router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;
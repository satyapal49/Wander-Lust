const Listing = require("../models/listing")



module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.createRoute = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created")
    req.flash("fail", "Listing Failed")
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
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
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings")
    } else {
        res.render("listings/show.ejs", { listing });
    }
};

module.exports.editPageRender = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("update", "Listing is updated");
    res.redirect(`/listings/${id}`); //
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("Delete", "Listing is Deleted");
    res.redirect("/listings");
}
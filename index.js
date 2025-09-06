const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js")
const wrapAsync = require("./utils/wrapAsync.js")
const listingSchema = require("./Schema.js")
const Review = require("./models/review.js");



async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
    console.log('Connected to MongoDB');
}


app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});


const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    } 
}


// Index Route - List all listings
app.get("/listings", wrapAsync(async(req, res, next)=> {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings})
}));

// new route and create route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs"); 
});

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


// show route
app.get("/listings/:id", wrapAsync(async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// edit route and update route
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})); 

app.put("/listings/:id", validateListing, wrapAsync(async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`); //
}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Reviews
app.post("/listings/:id/reviews", async(req, res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`)
})

// error handing middleware

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next)=>{
    let {status = 501, message = "Something went wrong"} = err;
    res.status(status).render("error.ejs", {err})
});

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
    main().catch(err => console.log(err));
});
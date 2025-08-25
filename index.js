const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');



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

// Index Route - List all listings
app.get("/listings", async(req, res)=> {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings})
});

// new route and create route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs"); 
});

app.post("/listings", async (req, res) => {
    // const newListing = new Listing(req.body);
    // let {title, description, image, price, location, country} = req.body;
    // const newListing = new Listing({title, description, image, price, location, country});
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});









// show route
app.get("/listings/:id", async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// edit route and update route
app.get("/listings/:id/edit", async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}); 

app.put("/listings/:id", async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`); //
});

//delete route
app.delete("/listings/:id", async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
    main().catch(err => console.log(err));
});
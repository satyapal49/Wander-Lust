const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
    console.log('Connected to MongoDB');
}

app.use(cookieParser());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));


const sessionOptions = { 
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 1000 * 60 * 60 * 24 * 3,
        httpOnly : true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.fail = req.flash("fail");
    res.locals.error = req.flash("error");
    res.locals.update = req.flash("update");
    next();
});

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)

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
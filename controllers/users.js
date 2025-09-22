const User = require("../models/user.js");



module.exports.renderSignup =  (req, res) => {
    res.render("users/signup.ejs")
};

module.exports.crateAccount = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser)
        req.login(registerUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome to Wonderlust!")
            res.redirect("/listings")
        })
    } catch (er) {
        req.flash("error", er.message);
        res.redirect("/signup")
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs")
};

module.exports.login = async (req, res) => {
req.flash("success", "Welcome back to wanderlust you are logged in");
let redirectUrl = res.locals.redirectUrl || "listings";
res.redirect(redirectUrl);
}

module.exports.logout = (req, res)=>{
    req.logout((err)=>{
        if(err) {
          return next(err);
        }
        req.flash("success", "You are a logged out !");
        res.redirect("/listings");
    })
};
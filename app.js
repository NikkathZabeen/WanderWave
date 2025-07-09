if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const expressError = require("./utils/expressError.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");
const passport = require('passport');

const dbUrl = process.env.ATLASDB_URL;
module.exports.map_token = process.env.MAP_TOKEN;
const db_secret = process.env.SECRET;



main()
    .then(() => {
        console.log("Working");
    })
    .catch(err => {
        console.log(err);
    });



async function main() {
    await mongoose.connect(dbUrl);
};


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', engine);


const store = MongoStore.create({

    mongoUrl: dbUrl,
    crypto: {
        secret: db_secret
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});


const sessionOptions = {
    store,
    secret: db_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.Success = req.flash("success");
    res.locals.errormsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/", usersRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter); '[['


app.all("*", (req, res, next) => {
    next(new expressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went wrong!" } = err;
    res.status(statuscode).render("listings/error.ejs", { message });
});


app.listen("8080", (req, res) => {
    console.log("App is listening:8080");
});
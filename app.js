// Initiates app
const express = require("express");
const app = express();

const flash = require('connect-flash');

console.log(Date.now());

// env variables
const dotenv = require("dotenv");
dotenv.config();

// Static files
app.use(express.static('frontend'));
app.use(express.static('data'));

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/profilePicture/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};



app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).single('image')
);

// body-parser..
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));

// Express session
const session = require('express-session');
app.use(
    session({
        secret: process.env.TOKEN_SECRET,
        resave: true,
        saveUninitialized: true
    })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Database
const mongoose = require("mongoose");
mongoose.connect(
    process.env.DB_CONNECT, {
        useNewUrlParser: true
    },
    () => console.log("connected to db!")
);

// passport - login
const passport = require("passport");
const loginPassportBlackbox = require("./config/passport");
loginPassportBlackbox(passport);

app.use(passport.initialize());
app.use(passport.session());

// Template Engine
app.set("view engine", "ejs");
// app.set("views", "templates");

// Routes
app.get("/", (req, res, next) => res.render("startpage"));

const adminRoutes = require("./routes/admin.js");
app.use("/admin", adminRoutes); // Login Register

const homepageRoutes = require("./routes/homepage.js");
app.use("/homepage", homepageRoutes); // Inside Homepage

app.use((req, res, next) => res.render("error404"));

// port

let port = process.env.PORT || 3000;
console.log(port);
app.listen(port, () => "I am Listening");
// listen EADDRINUSE: address already in use :::3000
// Solution : https://stackoverflow.com/questions/4075287/node-express-eaddrinuse-address-already-in-use-kill-server



// https://cloud.mongodb.com/v2/5cee5d22f2a30b0df1e0aedc#metrics/replicaSet/5cee5df43f4845f61a746d31/explorer

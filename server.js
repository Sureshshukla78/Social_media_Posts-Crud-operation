const express = require("express");
const ejs = require("ejs");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
require("./server/database/conn");
const User = require("./server/models/user");
const passport = require("passport");
const passportLocal = require('passport-local');
const session = require("express-session");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// authentication config
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    user = req.user;
    next();
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// load routers
app.use('/', require('./server/routes/router'));

app.listen(3000, () => {
    console.log('server started');
})
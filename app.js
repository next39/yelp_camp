const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
const User = require('./models/user');


//requring routes
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

const url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
mongoose.connect(url);
//mongoose.connect('mongodb://admin:admin@ds219000.mlab.com:19000/yelpcamp_alex');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); seed the database

//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "KXhkBWAAmAXBrSsZ",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use('/' ,indexRoutes);
app.use('/campgrounds' ,campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);





app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Server has started...');
});
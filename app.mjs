import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import methodOverride from 'method-override';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

import User from './models/user.mjs';
import seedDB from './seeds.mjs';
import log from './utils/log.mjs';

//requring routes
import campgroundRoutes from './routes/campgrounds.mjs';
import commentRoutes from './routes/comments.mjs';
import indexRoutes from './routes/index.mjs';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
//mongoose.connect('mongodb://admin:admin@ds219000.mlab.com:19000/Camp.ca_alex');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB(); seed the database

//PASSPORT CONFIGURATION
app.use(
    session({
        secret: 'KXhkBWAAmAXBrSsZ',
        resave: false,
        saveUninitialized: false
    })
);

console.log(process.env.port);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(4000, process.env.IP, () => {
    log(`Server has started on port ${4000}`, 'success');
});

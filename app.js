if(process.env.NODE_ENV !=="production"){
  require('dotenv').config()
}


console.log(process.env.SECRET)

const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session =require('express-session');
const MongoStore = require('connect-mongo');
const flash  = require('connect-flash');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/user')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')
//const db_Url = process.env.DB_URL
//'mongodb://localhost:27017/yelp-camp'
const dbUrl= 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl);
//Basic logic to check if there's an error
// and if it's successfully opened we can print out
//database connected!
const db =mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", ()=> {
    console.log("Database connected")
});

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});

const sessionConfg = {
  store,
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitializeג: true,
  cookies: {
    httpOnly: true,
    expires: Date.now() +1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
}
app.use(session(sessionConfg))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//we have to require our user model
passport.use(new LocalStrategy(User.authenticate()));

//this is telling passports how to serialize a user
//serialization-refers to how do we get data or how do we store a user in the session.
passport.serializeUser(User.serializeUser())
//how do you get the user out of that session
passport.deserializeUser(User.deserializeUser())

app.use((req,res, next) => {
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');

  next();
})

app.get('/fakeUser', async (req,res) => {
  const user = new User({email: 'coltttt@gmail.com', username: 'colttt'})
   const newUser = await User.register(user, 'chicken');
   res.send(newUser)
})
app.use('/', userRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get('/', (req,res) => {
  res.render('home')
});

//For every single request, for every path we're going to call this callback here
//The order is very very important and this will only run if nothing else has matched first
//and if we didn't respond from any of the routes here(poset,put,get etc..)
app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode =500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('error', { err });
})


  app.listen(3000, ()=> {
    console.log('Serving om port 3000')
})
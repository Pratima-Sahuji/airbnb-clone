if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
// console.log(process.env.SECRET );
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const express = require("express");
// const ejs= require("ejs");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
// https://www.geeksforgeeks.org/hashing-in-javasc
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlustt";
const dbUrl = process.env.ATLASDB_URL;

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const reviewsRouters = require('./routes/review.js');
const listingRouters = require("./routes/listing.js");
const userRouters = require("./routes/user.js");

main() 
  .then( ()=> {
    console.log("connected to db");
  })
  .catch((err)=>{
    console.log(err);
  });

async function main(){
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false, 
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

// app.get("/", (req,res) => {
//   res.send("hii , i am root");
// });  



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/demouser", async (req, res) =>{
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student",
  });

  let registerUser = await User.register(fakeUser, "helloworld");
  res.send(registerUser);
});

// const validateListing= (req, res, next) => {
//   let {error} = listingSchema.validate(req.body);
//   if(error) {
//     console.log(error);
//     let errMsg = error.details.map((el)=> el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else{
//     next();
//   }
// }

// const validateReview= (req, res, next) => {
//   let {error} = reviewSchema.validate(req.body);
//   if(error) {
//     let errMsg = error.details.map((el)=> el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else{
//     next();
//   }
// }

app.use("/listings" , listingRouters);
app.use("/listings/:id/reviews" ,reviewsRouters );
app.use("/" , userRouters);

// app.get("/testListing", async (req,res)=>{
//    let sampleListing = new Listing({
//      title: "my new villa",
//      description: "by my beach",
//      price: 1200,
//      location: "Calangute, Goa",
//      country: "India",
//    });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("success");
// })

// //index route
// app.get("/listings" ,wrapAsync( async (req,res)=> {
//        const allListings = await Listing.find({});
//        res.render("./listings/index.ejs" , {allListings});
// }));

// //new ROUTE
// app.get("/listings/new" , (req,res)=>{
//     res.render("./listings/new.ejs");
// });

// //show route
// app.get("/listings/:id",wrapAsync( async (req,res)=>{
//        let {id} = req.params;
//        const listing = await Listing.findById(id).populate("reviews");
//       res.render("./listings/show.ejs", {listing});
// }));

// //create route
// app.post("/listings",validateListing, wrapAsync( async(req,res)=>{
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));

// //edit route
// app.get("/listings/:id/edit" ,wrapAsync( async (req,res) =>{
//       let {id} = req.params;
//        const listing = await Listing.findById(id);
//        res.render("./listings/edit.ejs" , {listing});
// }));

// //update route
// app.put("/listings/:id" , validateListing, wrapAsync( async (req,res)=>{
//   let {id} = req.params;
//   await Listing.findByIdAndUpdate(id, {...req.body.listing});
//   res.redirect("/listings");
// }));

// //DELETE 
// app.delete("/listings/:id",wrapAsync( async (req,res) =>{
//   let{id}= req.params;
//   let deletedListing= await Listing.findByIdAndDelete(id);
//   res.redirect("/listings");
// }));

//reviews
// app.post("/listings/:id/reviews",validateReview ,wrapAsync( async(req, res) =>{
//        let listing = await Listing.findById(req.params.id);
//        let newReview = new Review(req.body.review);

//        listing.reviews.push(newReview);
       
//        await newReview.save();
//        await listing.save();
//        res.redirect(`/listings/${listing._id}`);
// }));

// app.post("/listings/:id/reviews",async(req, res) => {
  
//   // const idd = (req.params.id).trim();
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);
//   listing.reviews.push(newReview);
  

//   await newReview.save();
//   await listing.save();

//   // console.log("new review saved");
//   // res.send("new review saved");

//   res.redirect(`/listings/${listing._id}`);
  
// });

// //delete reviews
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
//   let {id, reviewId } = req.params;
//   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//   // res.redirect(`/listings/${listing._id}`);
//   res.redirect(`/listings/${id}`);
// }));



app.all("*", (req, res, next) =>{
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) =>{
  let{statusCode = 500, message = "Something went wrong"} = err;
  res.status(statusCode).render("error.ejs", {message});
  // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
})
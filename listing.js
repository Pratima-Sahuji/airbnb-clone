const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner, validateListing }= require("../middleware.js");
const Listing = require("../models/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings.js");

router.route("/")
.get(wrapAsync(listingController.index)) //index route
.post(isLoggedIn ,upload.single("listing[image]") , validateListing , wrapAsync ( listingController.createListing)); //create route


//new ROUTE
router.get("/new" ,isLoggedIn , (req,res)=>{
 res.render("./listings/new.ejs");
});

router.route("/:id")
.get(wrapAsync(listingController.showListing )) //show route
.put(isLoggedIn ,isOwner ,upload.single("listing[image]") , validateListing, wrapAsync( listingController.updateListing )) //update route
.delete(isLoggedIn, isOwner  , wrapAsync( listingController.deleteListing )); //delete route

// //index route
// router.get("/" ,wrapAsync(listingController.index));

// //new ROUTE
// router.get("/new" ,isLoggedIn , (req,res)=>{
//   // console.log(req.user);
//   // if(!req.isAuthenticated()){
//   //   req.flash("error", "you must be logged in to create listing!");
//   //   return res.redirect("/login");
//   // }
//  res.render("./listings/new.ejs");
// });

// //show route
// router.get("/:id",wrapAsync(listingController.showListing ));

// //create route
// router.post("/",isLoggedIn , validateListing, wrapAsync ( listingController.createListing));

//edit route
router.get("/:id/edit" , isLoggedIn, isOwner  , wrapAsync(listingController.editListing ));

// //update route
// router.put("/:id" ,isLoggedIn ,isOwner , validateListing, wrapAsync( listingController.updateListing ));

// //DELETE 
// router.delete("/:id",isLoggedIn, isOwner  , wrapAsync( listingController.deleteListing ));

module.exports = router;
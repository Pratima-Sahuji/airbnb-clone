const Listing = require("../models/listing");

module.exports.index = async (req,res)=> {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author"},}).populate("owner");
    if(!listing) {
      req.flash("error" , "Listing not found");
      res.redirect("/listings");
    }
    // console.log(listing);
   res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url , ".." , filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    await newListing.save();
    // req.flash("success", "New Listing Created");
    req.flash("success" , "New Listing Created");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res) =>{
    let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing) {
      req.flash("error" , "Listing not found");
      res.redirect("/listings");
    }
     res.render("./listings/edit.ejs" , {listing});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url , filename};
       await listing.save();
    };
    req.flash("success" , " Listing updated");
    res.redirect("/listings");
};

module.exports.deleteListing = async (req,res) =>{
    let{id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success" , " Listing deleted");
    res.redirect("/listings");
};
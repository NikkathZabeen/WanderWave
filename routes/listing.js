//use router.route

const express=require('express');
const router=express.Router();
const listing=require("../model/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");



const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });
 
 const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listing.js");
 
//index
router.get("/",wrapAsync(listingController.index));

//new
router.get("/new",isLoggedIn,listingController.renderNewForm);
//create
router.post("/",isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));
//icons
router.get("/category/:category",wrapAsync(listingController.displayListings));
//search
router.get("/search/:location",wrapAsync(listingController.searchListing));
//show
router.get("/:id([0-9a-fA-F]{24})",wrapAsync(listingController.showListing));
//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
//update
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

//delete
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;
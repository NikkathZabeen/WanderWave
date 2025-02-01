const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
 //post review route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

//delete route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
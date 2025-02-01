const Review=require("../model/reviews.js");
 const listing=require("../model/listing.js");

module.exports.createReview=async(req,res)=>{
    let Listing= await listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();
    req.flash("success","New review is created!");
    res.redirect(`/listings/${Listing._id}`);
};


module.exports.destroyReview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);

};

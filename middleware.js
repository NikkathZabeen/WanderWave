const listing=require("./model/listing.js");
const Review=require("./model/reviews.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const expressError=require("./utils/expressError.js");



module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must login");
    return res.redirect("/login");
}
next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();

};
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    console.log(Listing.owner);
    if(!Listing.owner[0].equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();

};

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error)
        {
            let errmsg=error.details.map((el)=>el.message).join(",");
            throw new expressError(400,errmsg);
        }
        else{
            next();
        }

};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    
    if(error)
        {
            console.log(validateReview);
            let errmsg=error.details.map((el)=>el.message).join(",");
            throw new expressError(400,errmsg);
        }
        else{
            next();
        }

};

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    console.log(review.author);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to delete the review");
        return res.redirect(`/listings/${id}`);
    }
    next();

};

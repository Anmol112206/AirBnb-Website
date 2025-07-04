const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
module.exports.isLoggedIn = (req,res,next)=>{
    //console.log(req.user);
    //console.log(req.path, ".." , req.originalUrl); req.path gives the relative path 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;  //it got reset after login that why we have to introduce res.locals
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner =async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{next();}
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{next();}
}

module.exports.isReviewAuthor =async (req,res,next)=>{
    let {id, reviewId} = req.params;
    let listing = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
const {campgroundSchema} =require('./schemas.js')
const ExpressError =require('./utils/ExpressError.js')
const Campground =require ('./models/campground')
const{reviewSchema} =require('./schemas.js')
const Review = require('./models/review')


module.exports.IsLoggedIn = (req, res, next) =>{
    console.log("REQ.USER..", req.user)
    if(!req.isAuthenticated()){
        //returnTo will be the URL that we want to redirect to
        req.session.returnTo = req.originalUrl;
        req.flash('error',"you must be signed in first")
       return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
    //  if(!req.body.campground) throw new ExpressError('Invalid campground Data!')
  
  const {error} =campgroundSchema.validate(req.body)
  if(error){
    const msg=error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
 }
/* 
//  router.get('/', (req,res)=>{
//     res.render('home')
// })
*/

module.exports.validateReview = (req,res, next) => {
  const{error} = reviewSchema.validate(req.body);
  if(error){
      const msg=error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg, 400)
    }else{
      next()
    }


}

module.exports.isAuthor =async(req,res,next) =>{
    const {id} =req.params;
    const campground = await Campground.findById(id);
    //if you dont own this campground
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do it');
        return res.redirect(`/campgrounds/${id}`)
    };
    next();

}


module.exports.isReviewAuthor =async(req,res,next) =>{
  const {id, reviewId} =req.params;
  const review = await Review.findById(reviewId);
  //if you dont own this campground
  if(!review.author.equals(req.user._id)){
      req.flash('error','You do not have permission to do it');
      return res.redirect(`/campgrounds/${id}`)
  };
  next();

}
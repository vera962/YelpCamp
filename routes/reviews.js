
const express = require('express');
const router = express.Router( {mergeParams: true} );
const Campground = require('../models/campground');
const Review = require('../models/review')
const {validateReview, IsLoggedIn, isReviewAuthor} = require('../middleware.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const reviews = require('../controllers/reviews') 

router.post('/',IsLoggedIn, validateReview, catchAsync(reviews.createReview))
   
   router.delete('/:reviewId', IsLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))
   
   module.exports = router;
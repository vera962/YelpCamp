const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {IsLoggedIn, isAuthor, validateCampground} = require('../middleware');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
   .get(catchAsync(campgrounds.index))
   .post(IsLoggedIn ,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
   
router.get('/new', IsLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
   .get( IsLoggedIn, catchAsync(campgrounds.showCampground))
   .put(IsLoggedIn,isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.renderUpdateForm))
   .delete(IsLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', IsLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))




module.exports = router;
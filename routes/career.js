const express = require('express')
const { getCareer, getCareers, updateCareer, createCareer, deleteCareer } = require('../controllers/career')
const advancedResults = require('../middlewares/advancedResults')
const Career = require('../models/Career')
const { protect, authorize } = require('../middlewares/auth')

// Include other resource routers
const linkRouter = require('./link')
const router = express.Router()

// Re-route into other resource routers
router.use('/:careerSlug/links', linkRouter)

router
    .route('/')
    .get(advancedResults(Career), getCareers)
    .post(protect, authorize('admin'), createCareer)

router
    .route('/:careerSlug')
    .get(getCareer)
    .put(protect, authorize('admin'), updateCareer)
    .delete(protect, authorize('admin'), deleteCareer)

module.exports = router

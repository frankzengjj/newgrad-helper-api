const express = require('express')
const { getLinks, createLink, getLink, updateLink, deleteLink } = require('../controllers/link')
const advancedResults = require('../middlewares/advancedResults')
const Link = require('../models/Link')
const { protect, authorize } = require('../middlewares/auth')


const router = express.Router({mergeParams: true})

router
    .route('/')
    .get(advancedResults(Link), getLinks)
    .post(protect, authorize('admin', 'user'), createLink)

router
    .route('/:id')
    .get(getLink)
    .put(protect, authorize('admin', 'user'), updateLink)
    .delete(protect, authorize('admin', 'user'), deleteLink)

// router
//     .route('/:slug')
//     .get(getCareer)
//     .put(updateCareer)
//     .delete(deleteCareer)

module.exports = router

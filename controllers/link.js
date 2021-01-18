const Link = require('../models/Link')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Career = require('../models/Career')
const _ = require('lodash')

/**
 * @description Get all links
 * @route GET /api/v1/careers/:slug/links
 * @access Public
 */
exports.getLinks = asyncHandler(async (req, res, next) => {
    if (req.params.careerSlug) {
        const career = await Career.find({ 'career': req.params.careerSlug })
        if (!career) {
            return next(new ErrorResponse(`No career found with slug of ${req.params.careerSlug}`, 404))
        }
    }
    res.status(200).json(res.advancedResults)
})

/**
 * @description Get one link
 * @route GET /api/v1/links/:id
 * @access Public
 */
exports.getLink = asyncHandler(async (req, res, next) => {
    const link = await Link.findById(req.params.id)
    if (!link) {
        return next(new ErrorResponse(`No Link with id of ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: link
    })
})

/**
 * @description Create one link
 * @route POST /api/v1/careers/:slug/link
 * @access Private
 */
exports.createLink = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id
    req.body.career = req.params.careerSlug
    const career = await Career.findOne({ 'slug': req.params.careerSlug })
    if (!career) {
        return next(new ErrorResponse(`Career not found with slug of ${req.params.careerSlug}`, 404))
    }
    const link = await Link.create(req.body)
    res.status(200).json({
        success: true,
        data: link
    })
})

/**
 * @description Update one link
 * @route PUT /api/v1/links/:id
 * @access Private
 */
exports.updateLink = asyncHandler(async (req, res, next) => {
    let link = await Link.findById(req.params.id)
    if (!link) {
        return next(new ErrorResponse(`No Link with id of ${req.params.id}`, 404))
    }

    if (link.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not allowed to update this link`, 401))
    }
    link = await Link.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: link
    })
})

/**
 * @description Delete one link
 * @route PUT /api/v1/links/:id
 * @access Private
 */
exports.deleteLink = asyncHandler(async (req, res, next) => {
    const link = await Link.findById(req.params.id)
    if (!link) {
        return next(new ErrorResponse(`No Link with id of ${req.params.id}`, 404))
    }
    if (link.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not allowed to update this link`, 401))
    }
    await link.remove()
    res.status(200).json({
        success: true,
        data: link
    })
})
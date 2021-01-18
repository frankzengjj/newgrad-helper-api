const Career = require('../models/Career')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const _ = require('lodash')

/**
 * @description Get all careers
 * @route GET /api/v1/careers/
 * @access Public
 */
exports.getCareers = asyncHandler(async (req, res, next) => {
    // const careers = await Career.find().populate('companies', 'company')
    // _.forEach(careers, career => {
    //     console.log('companies', career.companies)
    //     career.companies = _.countBy(career.companies, 'company')
    // })
    // // console.log(careers)
    // res.status(200).json({
    //     success: true,
    //     count: careers.length,
    //     data: careers
    // })
    res.status(200).json(res.advancedResults)
})

/**
 * @description Get one career
 * @route GET /api/v1/careers/:id
 * @access Public
 */
exports.getCareer = asyncHandler(async (req, res, next) => {

    const career = await Career.findOne({ 'slug': req.params.careerSlug })
    if (!career) {
        return next(new ErrorResponse(`Career not found with slug of ${req.params.careerSlug}`, 404))
    }
    res.status(200).json({ success: true, data: career })
})

/**
 * @description Create one career
 * @route POST /api/v1/careers/
 * @access Private
 */
exports.createCareer = asyncHandler(async (req, res, next) => {
    const data = req.body
    const career = await Career.create(data)
    res.status(201).json({
        success: true,
        message: 'career created successfully',
        data: career
    })
})

/**
 * @description Update one career
 * @route PUT /api/v1/careers/:id
 * @access Private
 */
exports.updateCareer = asyncHandler(async (req, res, next) => {
    const career = await Career.findOneAndUpdate({ 'slug': req.params.careerSlug }, req.body, {
        new: true,
        runValidators: true
    })

    if (!career) {
        return next(new ErrorResponse(`Career not found with slug of ${req.params.careerSlug}`, 404))
    }
    res.status(200).json({
        success: true,
        data: career
    })
})

/**
 * @description Delete one career
 * @route Delete /api/v1/career/:id
 * @access Private
 */
exports.deleteCareer = asyncHandler(async (req, res, next) => {
    const career = await Career.findOne({ 'slug': req.params.careerSlug })
    if (!career) {
        return next(new ErrorResponse(`Career not found with slug of ${req.params.careerSlug}`, 404))
    }
    career.remove()
    res.status(200).json({
        success: true,
        data: career
    })
})
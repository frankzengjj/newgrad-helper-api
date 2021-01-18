const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const _ = require('lodash')

/**
 * @description Create one user
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body
    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)
})


/**
 * @description Login one user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return next(new ErrorResponse('Please provide an email or password', 400))
    // Check for user
    const user = await User.findOne({ email }).select('+password')
    if (!user) return next(new ErrorResponse('Invalid credential', 401))
    // Check for password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) return next(new ErrorResponse('Invalid credential', 401))

    sendTokenResponse(user, 200, res)
})

/**
 * @description Login one user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.getMe = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user.id)
   res.status(200).json({
       success: true,
       data: user
   })
})

/**
 * @description Logout one user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 1000 * 10),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        data: {}
    })
 })
 

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken() 

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ 
            success: true,
            token
        })
}
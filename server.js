const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const db = require('./config/db')
const colors = require('colors')
const career = require('./routes/career')
const link = require('./routes/link')
const auth = require('./routes/auth')
const errorHandler = require('./middlewares/error')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')
const cors = require('cors')

dotenv.config({ path: './config/config.env'})
// Connect to DB
db()
const app = express()
// Middlewares
app.use(express.json()) //Body parser
app.use(mongoSanitize()) // Sanitize and Prevent NoSQL injection
app.use(helmet()) // Security headers
app.use(xss()) // Prevent cross-site scripting
app.use(cookieParser()) // cookie parser
app.use(hpp()) // Prevent http params pollution
app.use(cors()) // Enable cors
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
})
app.use(limiter)

// Dev logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
// Mount routes
app.use('/api/v1/careers', career)
app.use('/api/v1/links', link)
app.use('/api/v1/auth', auth)
// Error handler for routes
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    server.close(() => process.exit(1))
})
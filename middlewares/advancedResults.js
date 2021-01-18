const advancedResults = (model) => async (req, res, next) => {
    let query
    const filters = { ...req.query }
    const removeFields = ['page', 'limit', 'select']
    removeFields.forEach(param => delete filters[param])
    if (req.params.careerSlug) {
        filters['career'] = req.params.careerSlug
    }
    query = model.find(filters)
    // Select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments(filters)
    query = query.skip(startIndex).limit(limit)

    // Pagination result
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    const results = await query
    res.advancedResults = {
        success: true,
        pagination,
        count: results.length,
        data: results
    }
    next()
}

module.exports = advancedResults
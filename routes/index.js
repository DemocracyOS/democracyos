const express = require('express')
const router = express.Router()
const api = require('./api')

router.use('/api/v1.0', api)

module.exports = router

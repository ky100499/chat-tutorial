"use strict"

const router = require('express').Router()

router
.get('/', (req, res) => {
    res.redirect('/chat')
})
.use('/auth', require('./auth'))
.use('/chat', require('./chat'))
.use('/mongo', require('./mongo'))
.use('/stream', require('./stream'))

module.exports = router

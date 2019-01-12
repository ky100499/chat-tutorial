"use strict"

const router = require('express').Router()

router
.get('/', (req, res) => {
    res.redirect('/chat')
})
.use('/chat', require('./chat'))
.use('/mongo', require('./mongo'))

module.exports = router

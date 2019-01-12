"use strict"

const router = require('express').Router()

router
.get('/', (req, res) => {
    res.render("chat/main", {})
})
.use('/chat', require('./chat'))
.use('/test', require('./test'))
.use('/mongo', require('./mongo'))

module.exports = router

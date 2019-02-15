"use strict"

const router = require('express').Router()

router
.get('/', (req, res) => {
    res.render("stream/upload")
})

module.exports = router

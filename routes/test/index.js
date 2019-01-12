"use strict"

const router = require('express').Router()

router
.get('/', (req, res) => {
    res.render("test/main")
})

module.exports = router

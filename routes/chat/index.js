"use strict"

const router = require('express').Router()

router
.get('/:room_no', (req, res) => {
    res.render("chat/room", {
        'room_no': req.params.room_no
    })
})

module.exports = router

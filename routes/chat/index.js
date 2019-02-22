"use strict"

const router = require('express').Router()

router
.get('/', (req, res) => {
    res.render("chat/main", {})
})
.get('/:room_no', (req, res) => {
    if (typeof req.session.user_id === 'undefined') {
        req.session.alerts.push('로그인이 필요합니다.')
        console.log("Session@chat: ", req.session)
        res.redirect('/auth/login')
    } else {
        res.render("chat/room", {
            'room_no': req.params.room_no
        })
    }
})

module.exports = router

"use strict"

const PORT = 3000

const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      session = require('express-session')

app.use(session({
    secret: 'SECRETKEY@@',
    resave: false,
    saveUninitialized: true
}))

require('./socket/main')(http)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(express.static('public'))

app.use((req, res, next) => {
    // console.log("Session: ", req.session)
    if (!req.session.isRedirected) {
        req.session.alerts = []
    }
    res.locals.alerts = req.session.alerts ? req.session.alerts : []
    next()
})

app.use((req, res, next) => {
    res.locals.user_id = req.session.user_id ? req.session.user_id : ""
    res.locals.user_name = req.session.user_name ? req.session.user_name : ""
    res.locals.user_idx = req.session.user_idx ? req.session.user_idx : ""

    next()
})

app.use((req, res, next) => {
    req.session.isRedirected = false

    let _redirect = res.redirect

    res.redirect = function(status, url=302) {
        if (typeof url === 'Number') {
            temp = status
            status = url
            url = temp
        }
        req.session.isRedirected = true
        _redirect.call(this, status, url)
    }

    next()
})

app.use('/', require('./routes/main'))

http.listen(PORT, () => {
    console.log(`Server Running at localhost:${PORT}`)
})

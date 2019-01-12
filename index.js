"use strict"

const PORT = 3000

const express = require('express'),
      app = express(),
      http = require('http').Server(app)

require('./socket/main')(http)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(express.static('public'))

app.use('/', require('./routes/main'))

http.listen(PORT, () => {
    console.log(`Server Running at localhost:${PORT}`)
})

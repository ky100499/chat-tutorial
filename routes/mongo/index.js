"use strict"

const router = require('express').Router(),
      mongoose = require("mongoose")

let db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log("Connected to mongod server - /routes/mongo")
})

mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true})

let Chat = require("../../models/chat")

router
.get('/', (req, res) => {
    res.render("mongo/main")
})
.get('/create', (req, res) => {
    res.render("mongo/create")
})
.post('/create', (req, res) => {
    let chat = new Chat()

    chat.room_no = 1
    chat.type = req.body.type
    chat.name = req.body.name
    chat.msg = req.body.msg

    chat.save(err => {
        if (err) {
            console.error(err)
        } else {
            console.log("Saved")
        }
        res.redirect("/mongo/read")
    })
})
.get('/read', (req, res) => {
    Chat
    .find()
    .sort({
        "_id": -1
    })
    .limit(20)
    .exec((err, data) => {
        res.render("mongo/read", {
            "data": data
        })
    })
})
.get('/update', (req, res) => {
    Chat.find((err, data) => {
        res.render("mongo/update", {
            "edit": false,
            "data": data
        })
    })
})
.get('/update/:id', (req, res) => {
    Chat
    .findOne({
        "_id": mongoose.mongo.ObjectId(req.params.id)
    })
    .exec((err, data) => {
        res.render("mongo/update", {
            "edit": true,
            "data": data
        })
    })
})
.post('/update/:id', (req, res) => {
    Chat
    .findOne({
        "_id": mongoose.mongo.ObjectId(req.params.id)
    })
    .exec((err, data) => {
        data.type = req.body.type
        data.name = req.body.name
        data.msg = req.body.msg

        data.save(err => {
            if (err) {
                console.error(err)
            } else {
                console.log("Updated")
            }
            res.redirect("/mongo/update")
        })
    })
})
.get('/delete', (req, res) => {
    Chat.find((err, data) => {
        res.render("mongo/delete", {
            "data": data
        })
    })
})
.get('/delete/:id', (req, res) => {
    Chat
    .remove({
        "_id": mongoose.mongo.ObjectId(req.params.id)
    })
    .exec((err, output) => {
        if (err) {
            console.error(err)
        } else {
            console.log("Deleted")
        }
        res.redirect("/mongo/delete")
    })
})

module.exports = router

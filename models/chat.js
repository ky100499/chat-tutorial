"use strict"

let mongoose = require("mongoose")

let chatSchema = new mongoose.Schema({
    room_no: Number,
    type: String,
    name: String,
    msg: String,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("chat", chatSchema)

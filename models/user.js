"use strict"

let mongoose = require("mongoose")

let userSchema = new mongoose.Schema({
    name: String,
    id: String,
    pwd: String
})

module.exports = mongoose.model("user", userSchema)

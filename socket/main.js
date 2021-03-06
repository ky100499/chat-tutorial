"use strict"

const mongoose = require("mongoose")

let db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log("Connected to mongod server - /socket/main.js")
})

mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true})

let Chat = require("../models/chat")

module.exports = http => {
    const io = require('socket.io')(http)

    io.on('connection', socket => {
        //console.log("Connected")

        require('./stream')(socket)

        socket
        .on('join', data => {
            socket.room_no = data.room_no
            socket.user_idx = data.user_idx
            socket.client_name = data.client_name
            socket.join(data.room_no, err => {
                if (err)
                    console.error(err)
                else {
                    console.log(socket.client_name + " joined to room " + data.room_no)
                }
            })

            let chat = new Chat()

            chat.room_no = socket.room_no
            chat.type = "join"
            chat.user_idx = socket.user_idx
            chat.name = socket.client_name
            chat.msg = socket.client_name + " joined to room " + socket.room_no

            chat.save(err => {
                if (err) {
                    console.error(err)
                } else {
                    Chat
                    .find({'room_no': socket.room_no})
                    .sort({'date': -1})
                    .exec((err, data) => {
                        if (err) {
                            console.error(err)
                        } else {
                            socket.emit('history', data)
                        }
                    })
                }
            })
        })
        .on('disconnect', () => {
            if (socket.room_no !== undefined) {
                socket.leave(socket.room_no, err => {
                    if (err)
                        console.error(err);
                    else {
                        console.log(socket.client_name + " left the room " + socket.room_no);
                    }

                    let chat = new Chat()

                    chat.room_no = socket.room_no
                    chat.type = "leave"
                    chat.user_idx = socket.user_idx
                    chat.name = socket.client_name
                    chat.msg = socket.client_name + " left the room " + socket.room_no

                    chat.save(err => {
                        if (err) {
                            console.error(err)
                        } else {
                            // console.log("Saved")
                        }
                    })
                })
            }
            //console.log("Disconnected")
        })
        .on('message', data => {
            let chat = new Chat()

            chat.room_no = socket.room_no
            chat.type = "msg"
            chat.user_idx = socket.user_idx
            chat.name = socket.client_name
            chat.msg = data

            chat.save(err => {
                if (err) {
                    console.error(err)
                } else {
                    // console.log("Saved")
                }
            })

            socket.to(socket.room_no).broadcast.emit('message', {
                "name": socket.client_name,
                "msg": data,
                "date": Date.now()
            })
        })
    })
}

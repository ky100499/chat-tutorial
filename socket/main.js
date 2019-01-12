"use strict"

const mongoose = require("mongoose")

let db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
    console.log("Connected to mongod server")
})

mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true})

let Chat = require("../models/chat")

module.exports = http => {
    const io = require('socket.io')(http)

    io.on('connection', socket => {
        console.log("Connected")

        socket
        .on('join', data => {
            socket.room_name = data.room_name
            socket.client_name = data.client_name
            socket.join(data.room_name, err => {
                if (err)
                    console.error(err)
                else {
                    console.log(socket.client_name + " joined to room " + data.room_name)
                }
            })

            let chat = new Chat()

            chat.room_no = socket.room_name
            chat.type = "join"
            chat.name = socket.client_name

            chat.save(err => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("Saved")
                }
            })
        })
        .on('disconnect', data => {
            if (socket.room_name !== undefined) {
                socket.leave(socket.room_name, err => {
                    if (err)
                        console.error(err);
                    else {
                        console.log(socket.client_name + " left the room " + socket.room_name);
                    }
                })
            }
            console.log("Disconnected")
        })
        .on('message', data => {
            let chat = new Chat()

            chat.room_no = socket.room_name
            chat.type = "msg"
            chat.name = socket.client_name
            chat.msg = data

            chat.save(err => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("Saved")
                }
            })

            /*
            let result = {
                "name": socket.client_name,
                "msg": data
            }
            const FILENAME = HISTORY + socket.room_name + ".txt";
            fs.readFile(FILENAME, (err, data) => {
                if (err && err.errno === -2)
                    console.error(err)
                else if (err)
                    console.error(err)

                data = JSON.parse(data ? data.toString() : "[]")
                data.push(result)
                fs.writeFile(FILENAME, JSON.stringify(data), err => {
                    if (err)
                        console.error(err)
                })
            })
            */
            socket.to(socket.room_name).broadcast.emit('message', {
                "name": socket.client_name,
                "msg": data
            })
        })
    })
}

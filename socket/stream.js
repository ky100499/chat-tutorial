"use strict"

const ss = require('socket.io-stream'),
      path = require('path'),
      fs = require('fs')

module.exports = socket => {
    ss(socket).on('upload', (stream, data) => {
        console.log(data)
        var filename = path.join('./public/images', path.basename(data.name))
        console.log(filename)
        stream.pipe(fs.createWriteStream(filename))
    })
}
